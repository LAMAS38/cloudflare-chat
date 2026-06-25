# Publier sur GitHub (compte LAMAS38)

Prérequis : [GitHub CLI](https://cli.github.com/) installé et authentifié.

```powershell
# 1. Authentification (une seule fois)
gh auth login

# 2. Créer le dépôt et pousser
gh repo create cloudflare-chat --public --source=. --remote=origin --push --description "Salon de clavardage temps reel Cloudflare Workers + Durable Objects"
```

Si le dépôt existe déjà sur GitHub :

```powershell
git remote add origin https://github.com/LAMAS38/cloudflare-chat.git
git push -u origin main
```
