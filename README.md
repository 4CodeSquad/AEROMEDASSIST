# AEROMED ASSIST — React

Emergency-first multilingual React/Vite website.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Emergency contact

The site uses one central emergency phone constant in `src/config.js` so the phone number can be changed in one place later.

## Deployment & SEO

`npm run build` builds the client, then prerenders every page in every language to static HTML (`scripts/prerender.js`), and writes `sitemap.xml`, `robots.txt` and `404.html` into `dist/`.

- URLs: English at `/`, `/about`, `/services`, `/contact`; other languages under a prefix (`/sq`, `/it/services`, `/de/about`, ...).
- `SITE_URL` in `src/config.js` is the production domain used for canonical, hreflang, sitemap and social previews — keep it in sync with the live domain.
- Titles, descriptions, Open Graph tags and schema.org data come from `src/seo.js` and the `Meta*` keys in `src/data/translations.js`.
- Hosting rules serve `about.html` at `/about` and return a real 404 for unknown paths: Vercel (`vercel.json`, `cleanUrls`), Netlify (`public/_redirects`), Apache (`public/.htaccess`). For nginx use `try_files $uri $uri.html =404;` with `error_page 404 /404.html;`.
