# Publier sur GitHub (compte LAMAS38)

## GitHub CLI

Si `gh` n'est pas reconnu, installez-le depuis [cli.github.com](https://cli.github.com/) ou relancez le terminal après installation dans `%LOCALAPPDATA%\GitHubCLI`.

```powershell
# Vérifier que gh répond
gh --version

# Authentification (une seule fois, suivre les invites)
gh auth login
```

## Créer le dépôt et pousser

```powershell
gh repo create pulsechat --public --source=. --remote=origin --push --description "PulseChat — clavardage temps reel Cloudflare Workers + Durable Objects"
```

## Alternative sans gh

1. Créez un dépôt vide **pulsechat** sur [github.com/new](https://github.com/new) (compte LAMAS38, public, sans README).
2. Puis :

```powershell
git push -u origin main
```
