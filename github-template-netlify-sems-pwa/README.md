# Elektrotechnik Langsdorf – PV Monitor (SEMS, Netlify, PWA)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/DEIN_USER/DEIN_REPO)

## Quickstart (local test)
```bash
npm install
export SESSION_SECRET="$(openssl rand -hex 32)"   # PowerShell: $env:SESSION_SECRET="..."
npm run build
npm run serve   # http://localhost:8888
```

## Deploy to GitHub (one-liner)
```bash
./scripts/prepare-repo.sh <github_user> <repo_name>
# Windows:
# ./scripts/prepare-repo.ps1 -GithubUser <user> -RepoName <repo>
```

## Netlify
- After pushing to GitHub, click the **Deploy to Netlify** button above.
- In Netlify Dashboard → Site settings → Environment variables:
  - `SESSION_SECRET` = long random string
  - (optional) `SEMS_BASEURL` = https://www.semsportal.com
