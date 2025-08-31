#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "Usage: ./scripts/prepare-repo.sh <github_user> <repo_name>"
  exit 1
fi

USER="$1"
REPO="$2"
REMOTE="https://github.com/${USER}/${REPO}.git"

# replace deploy button link in README
tmpfile="$(mktemp)"
sed "s#https://github.com/DEIN_USER/DEIN_REPO#https://github.com/${USER}/${REPO}#g" README.md > "$tmpfile"
mv "$tmpfile" README.md

# init git & push
git init
git add .
git commit -m "Initial commit: SEMS PWA template"
git branch -M main
git remote add origin "$REMOTE"
git push -u origin main

echo "Done. Repo pushed to $REMOTE"
echo "Next: go to Netlify and click the Deploy button in README."
