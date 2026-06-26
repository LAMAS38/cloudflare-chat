# PulseChat

**PulseChat** — salon de clavardage temps réel propulsé par **Cloudflare Workers**, **Durable Objects**, **D1** et **Static Assets**.

## Fonctionnalités

- Salons indépendants via URL `/r/:slug`
- Communication temps réel par WebSocket
- Persistance des messages dans **Cloudflare D1** (index par salon + date)
- Un **Durable Object** par salon pour WebSocket et présence
- Historique des 50 derniers messages à la connexion
- Indicateur de frappe (« X est en train d'écrire… »)
- Nombre d'utilisateurs connectés
- Reconnexion automatique avec backoff exponentiel
- Interface responsive

## Stack

| Couche | Technologie |
|--------|-------------|
| Backend | Cloudflare Workers + Hono |
| Persistance | Cloudflare D1 (messages) + index `room_slug, created_at` |
| Temps réel | Durable Objects (WebSocket Hibernation API) |
| Frontend | React 19 + Vite 6 + Tailwind CSS 4 (Static Assets) |
| Langage | TypeScript strict |

## Structure du projet

```
pulsechat/
├── migrations/             # Schéma D1 (messages + index)
├── src/                    # Worker Hono + Durable Object
│   └── durable-objects/    # ChatRoom (WebSocket + rate limit)
│   └── lib/                # D1 helpers, rate limiting
├── shared/                 # Types et protocole WS partagés
├── frontend/               # Application React
├── wrangler.toml           # Configuration Cloudflare
└── package.json
```

## Prérequis

- Node.js 20+
- Compte [GitHub](https://github.com/) et [Cloudflare](https://cloudflare.com/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) authentifié (`npx wrangler login`)

## Installation

```bash
git clone https://github.com/LAMAS38/pulsechat.git
cd pulsechat

npm install
npm install --prefix frontend
```

## Développement local

```bash
npm run dev
```

Cela lance **deux serveurs en parallèle** :

| Service | URL | Rôle |
|---------|-----|------|
| Frontend (Vite) | [http://localhost:5173](http://localhost:5173) | UI React avec rechargement à chaud |
| Backend (Wrangler) | [http://localhost:8787](http://localhost:8787) | Worker + WebSocket + Durable Objects |

**Utilisez le port 5173** au quotidien — Vite proxifie `/r/*` et les WebSockets vers le Worker.

```bash
curl http://localhost:8787/health
# {"status":"ok"}
```

### Scripts utiles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Frontend (5173) + backend (8787) en parallèle |
| `npm run dev:ui` | Frontend Vite seul |
| `npm run dev:worker` | Worker Wrangler seul |
| `npm run dev:integrated` | Build prod du frontend + tout sur le port 8787 |
| `npm run deploy` | Build frontend + déploiement Cloudflare |
| `npm run ci` | Pipeline local (typecheck + lint + build) |
| `npm run lint` | Lint frontend (oxlint) |
| `npm run build:frontend` | Build React → `frontend/dist` |
| `npm run typecheck` | Vérification TypeScript (root + frontend) |

## CI/CD (GitHub Actions)

Pipeline complet dans `.github/workflows/ci-cd.yml` :

| Événement | Jobs |
|-----------|------|
| **Pull request** | Validate → Preview (URL par branche + commentaire sur la PR) |
| **Push `main`** | Validate → Deploy production + smoke test `/health` |
| **Run workflow** | Deploy production manuel |

Optimisations : action composite réutilisable, cache npm, artifacts entre jobs, annulation des runs concurrents, filtres de chemins.

### Secrets GitHub (Settings → Secrets → Actions)

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Token API — permission **Edit Cloudflare Workers** |
| `CLOUDFLARE_ACCOUNT_ID` | ID compte (`npx wrangler whoami`) |

Créer le token : [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) → template **Edit Cloudflare Workers**.

### Variables de dépôt (Settings → Variables → Actions)

| Variable | Exemple | Usage |
|----------|---------|--------|
| `WORKERS_DEV_SUBDOMAIN` | `hamidinelatifa` | Préfixes preview PR (`<branche>-pulsechat.<subdomain>.workers.dev`) |
| `VITE_SITE_URL` | `https://pulsechat.hamidinelatifa.workers.dev` | Build production (SEO / Open Graph) |

### Environnements GitHub (optionnel)

- **`production`** — approbation manuelle avant déploiement prod
- **`preview`** — règles séparées pour les previews PR

Déploiement manuel : **Actions → CI/CD → Run workflow**.

## Déploiement manuel

```bash
npx wrangler login
npm run db:migrate:remote   # première fois ou après nouvelle migration
npm run deploy
```

URL de production : `https://pulsechat.<votre-subdomaine>.workers.dev/r/<slug>`

> Chaque salon (`slug`) = un Durable Object pour le temps réel. Les messages sont stockés dans **D1** avec index par salon.

## Protocole WebSocket

Endpoint : `GET /r/:slug/ws?username=<pseudo>`

**Client → Serveur :**

```json
{ "type": "message", "content": "Bonjour !" }
{ "type": "typing", "isTyping": true }
```

**Serveur → Client :**

```json
{ "type": "history", "messages": [...] }
{ "type": "message", "message": { "id": 1, "roomSlug": "general", "username": "Alice", "content": "...", "createdAt": "..." } }
{ "type": "join", "username": "Alice", "userCount": 3 }
{ "type": "leave", "username": "Alice", "userCount": 2 }
{ "type": "typing", "username": "Alice", "isTyping": true }
{ "type": "users", "count": 3, "usernames": ["Alice", "Bob"] }
{ "type": "error", "code": "invalid_message", "message": "..." }
```

## Validation

- **Slug** : 3–32 caractères, `[a-z0-9-]`
- **Pseudo** : 2–24 caractères, lettres/chiffres/espaces/tirets

## Architecture

```
Client (React) ──HTTP──► Worker (Hono) ──► Static Assets (SPA)
                      └──WS /r/:slug/ws──► Durable Object (ChatRoom)
                                              │
                                              ├── WebSockets (broadcast, typing, présence)
                                              ├── Rate limiting (par pseudo)
                                              └── D1 (messages, index par salon)
```

Chaque salon = un Durable Object (`idFromName(slug)`). Messages persistés dans **D1** partagé, filtrés par `room_slug`.

## Grille technique

| Exigence | Implémentation |
|----------|----------------|
| Durable Object | `ChatRoom` — WebSocket + présence |
| WebSocket | Hibernation API, `/r/:slug/ws` |
| D1 | Table `messages` + migrations |
| 50 messages | `HISTORY_LIMIT = 50` à la connexion |
| Typing | Event `typing` client/serveur |
| Présence | `join` / `leave` / `users` |
| Reconnexion | Backoff exponentiel côté client |
| Rate limiting | 8 messages / 10 s par pseudo |
| Index D1 | `idx_messages_room_created`, `idx_messages_room_user_created` |
| Events | `shared/events.ts` typé |

## Licence

MIT
