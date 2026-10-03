import { readFileSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { contentHash } from "./content-hash.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, buildHead, buildLlmsTxt, buildSitemap, buildRobots, pageSourceFiles, routes, loadAllTranslations, NOT_FOUND } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);
await loadAllTranslations();
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

// Each language is a separate chunk; preload the page's own so hydration doesn't wait an extra round trip.
const manifestPath = path.join(dist, ".vite", "manifest.json");
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
function localePreload(lang) {
  const chunk = manifest[`src/data/locales/${lang}.js`];
  if (!chunk) throw new Error(`Prerender: no chunk for locale "${lang}" in the Vite manifest`);
  return `<link rel="modulepreload" crossorigin href="/${chunk.file}" />`;
}

function replaceOnce(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Prerender: template is missing ${pattern}`);
  return html.replace(pattern, () => value);
}

function renderPage(page, lang, { notFound = false } = {}) {
  const { title, description, head } = buildHead(page, lang);
  let html = template;
  html = replaceOnce(html, /<html lang="[^"]*">/, `<html lang="${lang}">`);
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  html = replaceOnce(html, /<!--app-head-->/, `${notFound ? '<meta name="robots" content="noindex" />' : head}\n    ${localePreload(lang)}`);
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${render(page, lang)}</div>`);
  return html;
}

// Sitemap <lastmod> comes from src/data/lastmod.json (kept current by scripts/sitemap-dates.js),
// used only while its hash still matches the page's source files; otherwise the build date.
const recorded = JSON.parse(await fs.readFile(path.join(root, "src/data/lastmod.json"), "utf8").catch(() => "{}"));
const buildDate = new Date().toISOString().slice(0, 10);
const stale = [];
const lastmodFor = (page, lang) => {
  const files = pageSourceFiles(page, lang);
  const entry = recorded[`${page}|${lang}`];
  if (entry && entry.hash === contentHash(files, (file) => readFileSync(path.join(root, file), "utf8"))) return entry.date;
  stale.push(`${page}|${lang}`);
  return buildDate;
};

async function write(file, contents) {
  const target = path.join(dist, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents);
}

for (const { page, lang, path: routePath } of routes) {
  await write(routePath === "/" ? "index.html" : `${routePath.slice(1)}.html`, renderPage(page, lang));
}

await write("404.html", renderPage(NOT_FOUND, "en", { notFound: true }));
await write("sitemap.xml", buildSitemap(lastmodFor));
if (stale.length) console.warn(`Prerender: src/data/lastmod.json is out of date for ${stale.length} page(s), used the build date. Run npm run sitemap-dates and commit.`);
await write("robots.txt", buildRobots());
await write("llms.txt", buildLlmsTxt());
await fs.rm(ssrDir, { recursive: true, force: true });
await fs.rm(path.dirname(manifestPath), { recursive: true, force: true });

// Finder writes ._<name> sidecars on non-APFS drives and Vite copies them out of public/; never ship them.
for (const file of await fs.readdir(dist, { recursive: true })) {
  if (path.basename(file).startsWith("._")) await fs.rm(path.join(dist, file), { force: true });
}

console.log(`Prerendered ${routes.length} pages + 404.html, sitemap.xml, robots.txt, llms.txt`);
