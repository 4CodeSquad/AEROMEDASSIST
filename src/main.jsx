import React from "react";
import ReactDOM from "react-dom/client";
import "./bootstrap.scss";
import "./styles.css";
import App from "./App";
import { loadTranslations } from "./data/i18n";
import { parsePath } from "./routes";

const { page, lang } = parsePath(window.location.pathname);
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App initialPage={page} initialLang={lang} />
  </React.StrictMode>
);

// Load only this page's language before the first render (the prerendered HTML modulepreloads it).
loadTranslations(lang).then(() => {
  // 404.html is prerendered in English only; for another language, render fresh instead of hydrating.
  if (root.hasChildNodes() && document.documentElement.lang === lang) {
    ReactDOM.hydrateRoot(root, app);
  } else {
    root.replaceChildren();
    ReactDOM.createRoot(root).render(app);
  }
});
