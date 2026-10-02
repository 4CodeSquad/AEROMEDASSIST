# SEO: how it works

The site is a Vite + React app that is **prerendered to static HTML** at build time, so every page's content, links, metadata and JSON-LD are in the HTML source. React then hydrates it.

```
npm run build
  1. vite build                    -> dist/ (client JS/CSS, one chunk per language)
  2. vite build --ssr              -> dist-ssr/entry-server.js (temporary)
  3. node scripts/prerender.js     -> dist/**/*.html for every page x language,
                                      404.html, sitemap.xml, robots.txt, llms.txt
```

## Where things live

| What | File |
|---|---|
| Production domain, brand name, phone, email | `src/config.js` (`SITE_URL` must match the live canonical domain, `https://www.…`) |
| Pages and URLs | `src/routes.js` (`pagePaths`, `buildPath`, `parsePath`) |
| The four services (slugs, copy keys, FAQ, `indexable`) | `src/data/services.js` |
| All visible copy and page titles/descriptions | `src/data/locales/<lang>.js` (`Meta<Page>Title`, `Meta<Page>Description`) |
| Language list, names, chunk loading | `src/data/i18n.js` |
| `<head>` tags, JSON-LD, sitemap, robots, llms.txt | `src/seo.js` |
| HTML generation | `scripts/prerender.js` |
| Hosting rules | `vercel.json` (live), `public/.htaccess` (Apache), `public/_redirects` (Netlify) |

## URLs

- English is at the root (`/`, `/about`, `/services`, `/services/air-ambulance`, `/contact`). The other languages use a prefix: `/sq/…`, `/it/…`, `/de/…`, `/fr/…`.
- Lowercase, no trailing slash, no `.html`. Vercel (`cleanUrls`, `trailingSlash: false`) and `.htaccess` 301-redirect the variants. Bare-domain and http requests redirect to `https://www.` (set in Vercel domain settings).
- Unknown paths return a real **404** with `dist/404.html` (noindex). The URL is not rewritten.

## Metadata (`buildHead` in `src/seo.js`)

Every prerendered page gets:
- `<html lang>`, a unique `<title>` and meta description (from `getPageMeta`)
- `robots`: `index, follow, max-image-preview:large`, or `noindex, follow` for pages not ready for search
- a self-referencing `canonical`
- `hreflang` for all 5 languages + `x-default` (English)
- Open Graph + Twitter card (`/og-image.png`, 1200×630, localized alt text)
- one JSON-LD `@graph`

The client only updates `document.title`, the description and `lang` when navigating. Crawlers get everything from the static HTML.

## Structured data (JSON-LD)

Built from the same translations/config the page renders, so it can't drift:

| Node | Where |
|---|---|
| `Organization` (`/#organization`) + `WebSite` (`/#website`) | every page |
| `WebPage` / `AboutPage` / `ContactPage` | every page |
| `BreadcrumbList` | every page except home (service pages: Home › Services › Service) |
| `Service` (`<url>#service`) | `/services` (all four) and each service page |
| `FAQPage` | service pages, only when FAQ entries exist |

Rules: only mark up what is visibly on the page. Never add `Review`/`AggregateRating` without real reviews shown on the page. No address, `geo` or `sameAs` until the client confirms them. Validate at https://validator.schema.org and https://search.google.com/test/rich-results after changes.

## Sitemap, robots, llms.txt

- `sitemap.xml` lists every **indexable** page in every language, with `xhtml:link` hreflang alternates.
- `<lastmod>` is the date of the last git commit that touched the page's source files plus its locale file (`pageSources` in `src/seo.js`). Without full git history (no `.git` or a shallow clone) it is omitted rather than guessed. After the first Vercel deploy, check that `/sitemap.xml` has `<lastmod>`. If it doesn't, the build has no full git history.
- `robots.txt` allows everything (including AI crawlers) and links the sitemap.
- `llms.txt` summarizes the business and key pages for AI assistants. `TODO(client)` lines in `buildLlmsTxt` must be replaced with confirmed facts before launch.

## Adding a page

1. Create the component in `src/pages/`, add it to `pageMap` in `src/App.jsx`.
2. Add the path to `pagePaths` in `src/routes.js`.
3. Add `Meta<Key>Title` (about 50–60 chars) and `Meta<Key>Description` (about 140–160 chars) to **all five** locale files, and map the path in `pageKeys` in `src/seo.js` (add a `pageTypes` entry if a more specific schema.org page type fits).
4. Add the page's source files to `pageSources` in `src/seo.js` (the build fails without it).
5. Use exactly one `<h1>`, sequential headings and `NavLink` (real `<a href>`) for internal links, with descriptive link text (not "learn more").
6. `npm run build`, then check `dist/<path>.html`: title, canonical, hreflang, JSON-LD.

Sitemap, hreflang, canonical and prerendering pick the page up automatically.

## Launching a service page

The four `/services/<slug>` pages exist in every language but are `noindex, follow` and left out of the sitemap until they have real content. See the `TODO(client)` block in `src/data/services.js`: add confirmed copy and FAQ entries, then set `indexable: true`.

## Performance rules

- Bootstrap is compiled from Sass with only the modules in use (`src/bootstrap.scss`). Using a new Bootstrap component or utility class means adding its module or utility key there.
- Fonts are self-hosted (`public/fonts`, latin subset, `font-display: swap`, preloaded in `index.html`). Files there are cached as immutable, so **change the file name** when replacing one.
- `/images`, icons and the OG image are cached for 30 days (not fingerprinted). Rename a file if it must update immediately.
- Each language is its own JS chunk; the prerender adds a `modulepreload` for the page's language.
- Give images explicit `width`/`height`; lazy-load anything below the fold; never lazy-load the LCP image.
