import React from "react";
import ReactDOM from "react-dom/client";
import "./bootstrap.scss";
import "./styles.css";
import App from "./App";
import { parsePath } from "./routes";

const { page, lang } = parsePath(window.location.pathname);
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App initialPage={page} initialLang={lang} />
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
