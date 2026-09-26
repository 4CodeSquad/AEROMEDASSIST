import { renderToString } from "react-dom/server";
import App from "./App";

export { buildHead, buildRobots, buildSitemap, routes } from "./seo";

export function render(page, lang) {
  return renderToString(<App initialPage={page} initialLang={lang} />);
}
