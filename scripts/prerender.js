import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

const { render, buildHead, buildSitemap, buildRobots, routes } = await import(
  pathToFileURL(path.join(ssrDir, "entry-server.js")).href
);
const template = await fs.readFile(path.join(dist, "index.html"), "utf8");

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
  html = replaceOnce(html, /<!--app-head-->/, notFound ? '<meta name="robots" content="noindex" />' : head);
  html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${render(page, lang)}</div>`);
  return html;
}

async function write(file, contents) {
  const target = path.join(dist, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, contents);
}

for (const { page, lang, path: routePath } of routes) {
  await write(routePath === "/" ? "index.html" : `${routePath.slice(1)}.html`, renderPage(page, lang));
}

await write("404.html", renderPage("/", "en", { notFound: true }));
await write("sitemap.xml", buildSitemap(new Date().toISOString().slice(0, 10)));
await write("robots.txt", buildRobots());
await fs.rm(ssrDir, { recursive: true, force: true });

console.log(`Prerendered ${routes.length} pages + 404.html, sitemap.xml, robots.txt`);
