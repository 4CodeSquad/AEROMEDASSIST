import { supportedLanguages } from "./data/i18n";
import { services } from "./data/services";

export const DEFAULT_LANGUAGE = "en";
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
  return { page: pagePaths.includes(path) ? path : "/", lang, known: pagePaths.includes(path) };
}
