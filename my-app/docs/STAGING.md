# Staging (Cloudflare)

Live staging deploys from branch **`staging`** to Worker **`locatrip-staging`** (`*.workers.dev`). Production (`main` → `locatrip` / `locatrip.app`) is unchanged.

## Bootstrap (once)

### Windows note

`npm run build:cf` / OpenNext needs **symlinks**. If you see `EPERM: operation not permitted, symlink`:

1. Enable **Developer Mode**: Settings → System → For developers → **Developer Mode** On  
   (or run `start ms-settings:developers`)
2. Restart the terminal, delete `my-app/.open-next` if present, retry `npm run build:cf`
3. Or skip local CF build: push to `staging` and let **GitHub Actions** (Linux) build/deploy — after you have `STAGING_APP_URL` set (first URL can come from a one-time deploy on CI/WSL/Admin once Developer Mode is on)

OpenNext does not fully support Windows without Developer Mode or WSL.

### Steps

1. From `my-app` (Cloudflare login / `CLOUDFLARE_API_TOKEN` + account id as for prod):

   ```bash
   npm ci
   npm run build:cf
   npm run deploy:cf:staging
   ```

2. Copy the printed URL, e.g. `https://locatrip-staging.<subdomain>.workers.dev` (no trailing slash).

3. GitHub → **Settings → Secrets and variables → Actions** → add **`STAGING_APP_URL`** = that URL.

4. Keycloak client **`localtrip-app`** — add:
   - Valid redirect URIs: `{STAGING_APP_URL}/auth/callback`, `{STAGING_APP_URL}/auth/silent`
   - Web origins: `{STAGING_APP_URL}`

5. Push to `staging` (or re-run **CI and Deploy**). Job **Deploy staging to Cloudflare Workers** builds with the secret and deploys.

## Ongoing

Every push to `staging` runs lint/build and auto-deploys staging. Same Railway public APIs as prod (`LOCALTRIP_USE_PUBLIC_API`).
