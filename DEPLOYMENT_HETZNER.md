# Hetzner Deployment

Last verified: May 14, 2026

This document describes the production deployment flow for `werkcv.nl`.

Default rule: **build in GitHub Actions, not on the Hetzner server**. The Hetzner VPS should only pull a prebuilt image and restart the app container.

## Current Production Layout

- Server: `root@65.108.243.208`
- Persistent deploy path: `/opt/werkcv`
- Live Docker project: `werkcv`
- App container: `werkcv-app-1`
- DB container: `werkcv-db-1`
- Live app port mapping on server: `3001:3000`
- Image registry: GitHub Container Registry (`ghcr.io`)
- Canonical deploy branch: `main`
- Current verified production commit: `84ba403243c54f985b0651bf261f72f8b98a6861`
- Current verified image: `ghcr.io/dk017/werkcv-app:sha-84ba403243c54f985b0651bf261f72f8b98a6861`

Branch history note:

- On May 14, 2026, `main` was realigned to the deployed production line after it had diverged from the active deploy branch.
- The old `main` pointer was preserved at `backup/main-before-production-realign-20260514`.
- The expat CV deployment branch `deploy/expat-cv-pages-20260514` currently points at the same production lineage, but future normal deploys should use `main`.

Important:

- Do not use `/tmp/werkcv-deploy-*` as the long-term deploy directory. It can disappear after reboot.
- Do not run `next build` or `docker compose build app` on the VPS during normal deploys.
- `/opt/werkcv/.env` remains the production environment source.
- `docker-compose.ghcr.yml` is the image-based production compose file for the Actions deploy flow.
- If a local branch other than `main` is checked out, confirm `git rev-parse HEAD` matches `git rev-parse origin/main` before pushing or deploying.
- Do not force-push `main` unless a backup branch has been created and the production lineage has been reviewed.

## Why This Changed

The app has grown large enough that `next build` can overload the VPS. In May 2026, a server-side Docker build made SSH and public HTTP time out. GitHub Actions built the same app image successfully in about 5 minutes without affecting production.

## One-Time GitHub Setup

The workflow lives at:

```text
.github/workflows/build-app-image.yml
```

Required GitHub repository secrets for automatic deploy:

```text
HETZNER_HOST=65.108.243.208
HETZNER_USER=root
HETZNER_SSH_KEY=<private SSH key that can access the server>
```

Optional secret:

```text
GHCR_READ_TOKEN=<GitHub token with package read access>
```

`GHCR_READ_TOKEN` is only needed if the package is private and the server cannot pull the image anonymously.

## Standard Deploy

Use this for normal production releases.

1. Commit the code you want to deploy.
2. Confirm your deploy branch is `main`, or push the exact reviewed commit to `main`.
3. Run the GitHub workflow: **Build app image**.
4. Set:
   - `deploy`: `true`
   - `deploy_dir`: `/opt/werkcv`

From local CLI, if authenticated with `gh`:

```bash
git fetch origin main
git status --short
git rev-parse HEAD
git rev-parse origin/main
git push origin main

gh workflow run "Build app image" \
  --repo dk017/werkcv \
  --ref main \
  -f deploy=true \
  -f deploy_dir=/opt/werkcv
```

Watch the run:

```bash
gh run watch --repo dk017/werkcv --exit-status
```

Expected result:

- GitHub Actions builds and pushes `ghcr.io/<owner>/werkcv-app:sha-<commit>`.
- The server pulls that image.
- `werkcv-app-1` is recreated.
- `werkcv-db-1` remains healthy.
- No production build runs on the VPS.

If you intentionally deploy from another branch, use the branch name in `--ref`, but still push or fast-forward `main` afterward so `main` remains the production source of truth.

## Manual Server Deploy From A Prebuilt Image

Use this if the image already exists in GHCR and you want to pull it manually.

SSH into the server:

```bash
ssh root@65.108.243.208
```

Then:

```bash
cd /opt/werkcv

export WERKCV_IMAGE=ghcr.io/<owner>/werkcv-app:sha-<commit>
export APP_PORT=3001

docker compose -p werkcv -f docker-compose.ghcr.yml pull app
docker compose -p werkcv -f docker-compose.ghcr.yml up -d app
docker compose -p werkcv ps
```

If the server already has the correct image and you only need to restart after an environment change:

```bash
cd /opt/werkcv

export WERKCV_IMAGE=$(docker inspect --format='{{.Config.Image}}' werkcv-app-1)
export APP_PORT=3001

docker compose -p werkcv -f docker-compose.ghcr.yml up -d app
docker compose -p werkcv -f docker-compose.ghcr.yml ps
```

If GHCR requires login:

```bash
echo "$GHCR_READ_TOKEN" | docker login ghcr.io -u <github-user> --password-stdin
```

## Verify

Check containers:

```bash
ssh root@65.108.243.208 'docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"'
```

Check logs:

```bash
ssh root@65.108.243.208 'docker logs werkcv-app-1 --tail 80'
```

Check the app from inside the server:

```bash
ssh root@65.108.243.208 'curl -o /dev/null -s -w "LOCAL_HOME=%{http_code}\n" http://127.0.0.1:3001/'
ssh root@65.108.243.208 'curl -o /dev/null -s -w "LOCAL_TOOLS=%{http_code}\n" http://127.0.0.1:3001/tools/'
```

Check the public site:

```bash
curl -o /dev/null -s -w 'PUBLIC_HOME=%{http_code}\n' https://werkcv.nl/
curl -o /dev/null -s -w 'PUBLIC_TOOLS=%{http_code}\n' https://werkcv.nl/tools/
```

If you deployed a specific page or tool, verify that URL directly.

Example:

```bash
curl -o /dev/null -s -w 'PUBLIC_KM=%{http_code}\n' https://werkcv.nl/tools/kilometervergoeding-berekenen
```

For checkout or pricing changes, also verify the live copy and checkout logs:

```bash
curl -s https://werkcv.nl/prijzen | grep -E '€4,99|Geen abonnement'
ssh root@65.108.243.208 'docker logs werkcv-app-1 --tail 160 2>&1 | grep -Ei "checkout_failed|Polar checkout failed|Price is archived|checkout_started" | tail -60'
```

## Rollback

Use the same image-based deploy flow with the previous known-good image tag.

```bash
ssh root@65.108.243.208
cd /opt/werkcv

export WERKCV_IMAGE=ghcr.io/<owner>/werkcv-app:sha-<previous-good-commit>
export APP_PORT=3001

docker compose -p werkcv -f docker-compose.ghcr.yml pull app
docker compose -p werkcv -f docker-compose.ghcr.yml up -d app
docker compose -p werkcv ps
```

## Emergency Fallback Only

Avoid this during normal deploys. It builds on the production VPS and can overload the server.

Only consider it if GitHub Actions/GHCR is unavailable and the change is urgent.

```bash
ssh root@65.108.243.208
cd /opt/werkcv

git fetch origin main
git checkout <commit-sha>

docker compose -p werkcv up -d --build app
docker compose -p werkcv ps
```

Before using this fallback, confirm:

- `/opt/werkcv/docker-compose.yml` maps `3001:3000`.
- `git status --short` has no unrelated changes you might ship by accident.
- The server has enough memory and disk space.

## Do Not Do This

Do not build from a temporary `/tmp/werkcv-deploy-*` directory as the standard deploy path. It is not persistent across reboot and makes recovery harder.

Do not run this casually:

```bash
cd /opt/werkcv
docker compose up -d --build app
```

That can silently deploy local server-only changes and can overload the VPS.

## Known Notes

- A transient `Failed to find Server Action` log right after a deploy can happen if an older browser tab hits the new container with stale action IDs. That is not automatically a bad deploy.
- The DB schema push currently runs inside the app container startup. Check logs if startup is slower than expected. Longer term, move schema changes into a separate deploy step.
- If the app container is up but public checks fail, confirm nginx is active and the app is listening on port `3001`.
- Checkout uses Polar. On May 14, 2026, `POLAR_PRICE_ID_CV_DOWNLOAD` in `/opt/werkcv/.env` pointed to an archived price and caused checkout creation to fail with `Polar checkout failed (422): Price is archived`.
- The immediate fix was to comment out the archived `POLAR_PRICE_ID_CV_DOWNLOAD` line and restart the app so checkout used `POLAR_PRODUCT_ID_CV_DOWNLOAD`.
- The code now includes a fallback from explicit Polar price ID to product ID, but production env should still avoid archived price IDs.
