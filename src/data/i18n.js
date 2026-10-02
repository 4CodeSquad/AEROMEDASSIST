// Each language lives in its own module (src/data/locales/<lang>.js) so the client bundle
// only ships the language being viewed. Load a language before rendering with it.
export const supportedLanguages = ["en", "sq", "it", "de", "fr"];

// Shown in the language switcher, so every name is needed without loading every language.
export const languageNames = { en: "English", sq: "Shqip", it: "Italiano", de: "Deutsch", fr: "Français" };

// Literal import() calls so Vite emits one chunk per language.
const loaders = {
  en: () => import("./locales/en.js"),
  sq: () => import("./locales/sq.js"),
  it: () => import("./locales/it.js"),
  de: () => import("./locales/de.js"),
  fr: () => import("./locales/fr.js"),
};

const loaded = {};

export async function loadTranslations(lang) {
  loaded[lang] ??= (await loaders[lang]()).default;
  return loaded[lang];
}

export const loadAllTranslations = () => Promise.all(supportedLanguages.map(loadTranslations));

export function getTranslations(lang) {
  if (!loaded[lang]) throw new Error(`Translations for "${lang}" used before loadTranslations()`);
  return loaded[lang];
}
