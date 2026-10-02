import { supportedLanguages } from "./data/i18n";
import { services } from "./data/services";

export const DEFAULT_LANGUAGE = "en";
// Page key for unknown paths; rendered into dist/404.html and never given a URL of its own.
export const NOT_FOUND = "404";
export const pagePaths = ["/", "/about", "/services", ...services.map((service) => service.path), "/contact"];

export function buildPath(page, lang) {
  if (lang === DEFAULT_LANGUAGE) return page;
  return page === "/" ? `/${lang}` : `/${lang}${page}`;
}

export function parsePath(pathname) {
  const segments = pathname.toLowerCase().split("/").filter(Boolean);
  const lang = supportedLanguages.includes(segments[0]) && segments[0] !== DEFAULT_LANGUAGE
    ? segments.shift()
    : DEFAULT_LANGUAGE;
  const path = `/${segments.join("/")}`;
  return { page: pagePaths.includes(path) ? path : NOT_FOUND, lang, known: pagePaths.includes(path) };
}
