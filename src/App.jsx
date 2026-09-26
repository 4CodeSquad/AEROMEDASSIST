import { useEffect, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmergencyBar from "./components/EmergencyBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import { EMERGENCY_PHONE_HREF } from "./config";
import { supportedLanguages, translations } from "./data/translations";

const pageMap = {
  "/": Home,
  "/about": About,
  "/services": Services,
  "/contact": Contact,
};

function getPageFromPath() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, "") || "/";
  return pageMap[path] ? path : "/";
}

function getLanguageFromUrl() {
  const lang = new URLSearchParams(window.location.search).get("lang");
  return supportedLanguages.includes(lang) ? lang : "en";
}

export default function App() {
  const [page, setPage] = useState(getPageFromPath);
  const [lang, setLang] = useState(getLanguageFromUrl);
  const [showFloatingHelp, setShowFloatingHelp] = useState(false);
  const t = useMemo(() => translations[lang] || translations.en, [lang]);
  const Page = pageMap[page] || Home;

  useEffect(() => {
    document.documentElement.lang = lang;

    const pageTitles = {
      "/": t.MetaHomeTitle,
      "/about": t.MetaAboutTitle,
      "/services": t.MetaServicesTitle,
      "/contact": t.MetaContactTitle,
    };

    const pageDescriptions = {
      "/": t.MetaHomeDescription,
      "/about": t.MetaAboutDescription,
      "/services": t.MetaServicesDescription,
      "/contact": t.MetaContactDescription,
    };

    document.title = pageTitles[page] || "AEROMED ASSIST";

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", pageDescriptions[page] || t.MetaHomeDescription);
    }
  }, [lang, page, t]);

  useEffect(() => {
    // Unknown paths (e.g. the removed /fleet page) render Home, so make the URL match.
    const path = window.location.pathname.toLowerCase().replace(/\/$/, "") || "/";
    if (path !== page) {
      window.history.replaceState({}, "", `${page}?lang=${lang}${window.location.hash}`);
    }
    // Run once on load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const nextPage = getPageFromPath();
      setLang(getLanguageFromUrl());

      // In-page anchor links (e.g. #process) also fire popstate; only reset scroll on a real page change.
      if (nextPage !== page) {
        setPage(nextPage);
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [page]);

  useEffect(() => {
    // The header and hero already carry call buttons; only show the floating one once they have scrolled away.
    const onScroll = () => setShowFloatingHelp(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (path, nextLang = lang) => {
    const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
    const url = `${normalized}?lang=${nextLang}`;

    window.history.pushState({}, "", url);
    setPage(normalized);
    setLang(nextLang);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeLanguage = (nextLang) => {
    navigate(page, nextLang);
  };

  return (
    <>
      <Header
        t={t}
        lang={lang}
        page={page}
        navigate={navigate}
        changeLanguage={changeLanguage}
      />

      <main>
        <Page t={t} lang={lang} navigate={navigate} />
      </main>

      <Footer t={t} lang={lang} page={page} navigate={navigate} />

      <a
        className={`floating-help d-none d-lg-flex ${showFloatingHelp ? "is-visible" : ""}`}
        href={EMERGENCY_PHONE_HREF}
        aria-label={t.CallNow}
      >
        <Phone size={23} aria-hidden="true" />
        <em>24/7</em>
      </a>

      <EmergencyBar t={t} />
    </>
  );
}
