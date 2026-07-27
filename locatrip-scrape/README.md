# LocaTrip scrape mirror

Offline/local mirror of https://locatrip.framer.website/

## How it was built

`website-scraper-cli` (npm `0.0.1`) is a **stub** — its `download` command only prints the destination path and does not scrape.

Scraping was done with the real **`website-scraper`** library (dependency of that CLI):

```bash
cd tools/scraper
npm run scrape:all   # homepage + recursive pages, then CDN JS/fonts
npm run sync         # copy → my-app/public/scrape
```

## Layout

- `locatrip.framer.website/` — HTML pages (`/`, `/about`, `/tours`, …)
- `framerusercontent.com/` — images, fonts, Framer site `.mjs` bundles
- `fonts.gstatic.com/` — Cal Sans / other fonts when captured

## Served from my-app

Next.js `middleware.ts` rewrites:

- `/` → scraped homepage HTML
- `/about`, `/tours`, … → matching scraped pages
- `/framerusercontent.com/*` → local asset mirror
