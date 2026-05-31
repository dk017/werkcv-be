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

## Recommended production shape

### Keep shared

- Same Hetzner VPS
- Same Postgres container
- Same mail provider class
- Same deployment pattern (GitHub Actions -> GHCR -> pull image on server)

### Separate

- GitHub repository for `werkcv-be`
- GHCR image name for `werkcv-be`
- deploy directory, for example `/opt/werkcv-be`
- Docker compose project name, for example `werkcv-be`
- app host port, for example `3002`
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

## Suggested BE `.env`

Example shape:

```text
DATABASE_URL=postgresql://postgres:***@db:5432/werkcv_be
POSTGRES_USER=postgres
POSTGRES_PASSWORD=***
POSTGRES_DB=werkcv_be

NEXT_PUBLIC_BASE_URL=https://werkcv.be
AUTH_FROM_EMAIL=contact@werkcv.be
CONTACT_TO_EMAIL=contact@werkcv.be
B2B_LEADS_TO=contact@werkcv.be

SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

DODO_API_KEY=...
DODO_WEBHOOK_SECRET=...
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
werkcv.be app   -> host port 3002
```

Then route domains at the reverse proxy level.

---

## Compose / project naming

Current NL stack uses project name:

```text
werkcv
```

Recommended BE stack:

```text
werkcv-be
```

This avoids container-name collisions and keeps maintenance clearer.

---

## Repo and image naming

Recommended GitHub repo:

```text
dk017/werkcv-be
```

Recommended image naming:

```text
ghcr.io/dk017/werkcv-be-app
```

Do not reuse the current NL image name if the repositories are separate.

---

## Immediate next steps

1. Create GitHub repo for `werkcv-be`
2. Push the Belgian fork there
3. Add a dedicated BE GitHub Actions workflow or adapt the current one for the new repo
4. Create Postgres database `werkcv_be`
5. Create `/opt/werkcv-be` on the Hetzner server
6. Add BE `.env`
7. Deploy BE app on a separate host port
8. Point `werkcv.be` to the BE stack

---

## Do not change

Do not change the existing Dutch production stack just to fit the Belgian launch.

The safe rule is:

- add new database
- add new deploy path
- add new app stack
- leave `werkcv.nl` alone
