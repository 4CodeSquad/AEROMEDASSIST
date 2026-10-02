import { renderToString } from "react-dom/server";
import App from "./App";

export { loadAllTranslations } from "./data/i18n";
export { NOT_FOUND } from "./routes";
export { buildHead, buildRobots, buildSitemap, pageSourceFiles, routes } from "./seo";

export function render(page, lang) {
  return renderToString(<App initialPage={page} initialLang={lang} />);
}
