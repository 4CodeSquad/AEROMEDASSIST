// Writes src/data/lastmod.json: for every page x language, the date its content last changed
// and a hash of that content. The prerender uses it for sitemap <lastmod>, because Vercel's
// build does not have the full git history needed to work the dates out there.
//
// Runs automatically from the pre-commit hook (.githooks/pre-commit) and at the start of
// `npm run build`. It describes the *staged* content: if a page's files are staged and differ
// from HEAD, the commit being made is the latest change, so the date is today.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { contentHash } from "./content-hash.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(root, "src/data/lastmod.json");

function git(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

if (git(["rev-parse", "--is-shallow-repository"]) !== "false") {
  console.log("sitemap-dates: no full git history (e.g. Vercel build), keeping the committed src/data/lastmod.json");
  process.exit(0);
}

// src/ uses extensionless imports, so load it through Vite as the build does.
const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
const { routes, pageSourceFiles } = await vite.ssrLoadModule("/src/seo.js");
await vite.close();

const today = new Date().toLocaleDateString("sv-SE"); // YYYY-MM-DD, local time
const hasHead = git(["rev-parse", "--verify", "-q", "HEAD"]) !== null;
// Content as staged in the index (untrimmed); falls back to the working tree for untracked files.
const staged = (file) => {
  try {
    return execFileSync("git", ["show", `:${file}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  } catch {
    return fs.readFileSync(path.join(root, file), "utf8");
  }
};

const dates = {};
for (const { page, lang } of routes) {
  const files = pageSourceFiles(page, lang);
  const changedSinceHead = !hasHead || git(["diff", "--cached", "--quiet", "HEAD", "--", ...files]) === null;
  const date = changedSinceHead ? today : git(["log", "-1", "--format=%cs", "HEAD", "--", ...files]) || today;
  dates[`${page}|${lang}`] = { date, hash: contentHash(files, staged) };
}

const json = `${JSON.stringify(dates, null, 2)}\n`;
if (!fs.existsSync(outFile) || fs.readFileSync(outFile, "utf8") !== json) {
  fs.writeFileSync(outFile, json);
  console.log(`sitemap-dates: updated src/data/lastmod.json (${Object.keys(dates).length} pages)`);
}
