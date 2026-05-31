# WerkCV Belgium Deployment Notes

Last updated: May 31, 2026

## Goal

Deploy `werkcv.be` as a separate production app from `werkcv.nl` without touching the Dutch production line that already works.

The Belgian deployment should be isolated at these levels:

- separate Git repository
- separate Docker project / deploy directory
- separate Postgres database
- separate `.env`
- separate domain / reverse-proxy host rule

It does **not** need a separate server.

---

## Confirmed current server shape

- public reverse proxy: **nginx**
- Dutch app proxy target: `127.0.0.1:3001`
- local tools app uses `3000`
- `3002` is already occupied by another local app on the VPS
- shared Postgres container is in the Docker network:

```text
werkcv_default
```

- Dutch app container is attached there as:

```text
werkcv-app-1
```

- shared Postgres container name:

```text
werkcv-db-1
```

This means the Belgian app should use a **different host port**, and `3003` is the clean default.

---

## Recommended production shape

### Keep shared

- Same Hetzner VPS
- Same Postgres container
- Same deployment pattern (GitHub Actions -> GHCR -> pull image on server)

### Separate

- GitHub repository for `werkcv-be`
- GHCR image name: `ghcr.io/dk017/werkcv-be-app`
- deploy directory: `/opt/werkcv-be`
- Docker compose project name: `werkcv-be`
- app host port: `3003`
- Postgres database name: `werkcv_be`
- `.env` file in `/opt/werkcv-be/.env`

---

## Database decision

Use a **separate database** on the same Postgres server.

Recommended database name:

```text
werkcv_be
```

Reason:

- current schema has no hard site partition
- users, CVs, orders, analytics and follow-up data would mix if `.nl` and `.be` share one database
- later reporting and operational cleanup would become harder

Do **not** share the current `werkcv` database with `werkcv.be`.

---

## Environment-variable rule

### Inside the BE app

Keep the normal variable names.

Examples:

```text
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
AUTH_FROM_EMAIL
CONTACT_TO_EMAIL
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
DODO_API_KEY
DODO_WEBHOOK_SECRET
```

This is the correct approach because the Belgian app runs from its own `.env`.

### Do not do this inside the app unless there is a real need

```text
DATABASE_URL_BE
SMTP_HOST_BE
AUTH_FROM_EMAIL_BE
```

That only makes the app code noisier.

### Where `_BE` naming is useful

At the host / CI / secret coordination layer, `_BE` naming is fine.

Examples:

```text
WERKCV_BE_IMAGE
WERKCV_BE_DEPLOY_DIR
WERKCV_BE_APP_PORT
WERKCV_BE_DOMAIN
```

That is external coordination, not app runtime configuration.

---

## Shared Postgres connection model

The Belgian app should **not** start its own Postgres container.

Instead:

- attach the BE app to the existing Docker network:

```text
werkcv_default
```

- point `DATABASE_URL` to:

```text
postgresql://postgres:***@werkcv-db-1:5432/werkcv_be
```

This keeps the app and database separation clean without introducing another database container.

---

## Suggested BE `.env`

Example shape:

```text
DATABASE_URL=postgresql://postgres:***@werkcv-db-1:5432/werkcv_be
POSTGRES_USER=postgres
POSTGRES_PASSWORD=***
POSTGRES_DB=werkcv_be
APP_PORT=3003

NEXT_PUBLIC_APP_URL=https://werkcv.be
AUTH_FROM_EMAIL=contact@werkcv.be
CONTACT_TO_EMAIL=contact@werkcv.be
B2B_LEADS_TO=contact@werkcv.be

SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

DODO_API_KEY=...
DODO_PRODUCT_ID=...
DODO_WEBHOOK_SECRET=...
DODO_ENVIRONMENT=live_mode
```

Use Belgian addresses and Belgian base URL values in the BE `.env`.

---

## Suggested Hetzner layout

```text
/opt/werkcv
  -> current Dutch deployment

/opt/werkcv-be
  -> Belgian deployment
```

Recommended runtime split:

```text
werkcv.nl app   -> host port 3001
werkcv.be app   -> host port 3003
```

Then route domains at the nginx level.

---

## Nginx routing

The server currently proxies:

- `werkcv.nl` -> `127.0.0.1:3001`

For Belgium, add a new nginx server block:

```text
werkcv.be
www.werkcv.be
```

Proxy target:

```text
http://127.0.0.1:3003
```

---

## Repo and image naming

GitHub repo:

```text
dk017/werkcv-be
```

Image naming:

```text
ghcr.io/dk017/werkcv-be-app
```

---

## Immediate next steps

1. Create Postgres database `werkcv_be`
2. Create `/opt/werkcv-be` on the Hetzner server
3. Add `/opt/werkcv-be/.env`
4. Deploy BE app on host port `3003`
5. Add nginx config for `werkcv.be`
6. Point DNS A record for `werkcv.be` to `65.108.243.208`
7. Issue/refresh TLS cert for `werkcv.be`

---

## Do not change

Do not change the existing Dutch production stack just to fit the Belgian launch.

The safe rule is:

- add new database
- add new deploy path
- add new app stack
- leave `werkcv.nl` alone
