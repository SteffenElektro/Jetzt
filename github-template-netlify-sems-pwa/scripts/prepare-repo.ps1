param(
  [Parameter(Mandatory=$true)][string]$GithubUser,
  [Parameter(Mandatory=$true)][string]$RepoName
)

$Remote = "https://github.com/$GithubUser/$RepoName.git"

# Replace placeholder in README
(Get-Content -Raw README.md).Replace("https://github.com/DEIN_USER/DEIN_REPO", "https://github.com/$GithubUser/$RepoName") | Set-Content README.md -Encoding UTF8

git init
git add .
git commit -m "Initial commit: SEMS PWA template"
git branch -M main
git remote add origin $Remote
git push -u origin main

Write-Host "Done. Repo pushed to $Remote"
Write-Host "Next: go to Netlify and click the Deploy button in README."
