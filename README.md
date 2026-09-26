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

## Deployment

Pages (`/about`, `/services`, `/contact`) are client-side routes, so the host must serve `index.html` for any unknown path. Rewrite rules are included for Netlify (`public/_redirects`), Vercel (`vercel.json`) and Apache (`public/.htaccess`). For nginx use `try_files $uri /index.html;`.
