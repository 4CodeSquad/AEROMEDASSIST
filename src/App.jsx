import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import EmergencyBar from "./components/EmergencyBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ServicePage from "./pages/ServicePage";
import { EMERGENCY_PHONE_HREF } from "./config";
import { serviceByPath } from "./data/services";
import { getTranslations, loadTranslations } from "./data/i18n";
import { buildPath, parsePath } from "./routes";
import { getPageMeta } from "./seo";

const pageMap = {
  "/": Home,
  "/about": About,
  "/services": Services,
  "/contact": Contact,
};

export default function App({ initialPage, initialLang }) {
  const [page, setPage] = useState(initialPage);
  const [lang, setLang] = useState(initialLang);
  const [showFloatingHelp, setShowFloatingHelp] = useState(false);
  const t = getTranslations(lang);
  const service = serviceByPath[page];
  const Page = service ? ServicePage : pageMap[page] || Home;

  useEffect(() => {
    const meta = getPageMeta(page, lang);
    document.documentElement.lang = lang;
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
  }, [lang, page]);

  useEffect(() => {
    // Unknown paths (e.g. the removed /fleet page) render Home, so make the URL match.
    const canonicalPath = buildPath(page, lang);
    if (window.location.pathname !== canonicalPath || window.location.search) {
      window.history.replaceState({}, "", `${canonicalPath}${window.location.hash}`);
    }
    // Run once on load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onPopState = async () => {
      const { page: nextPage, lang: nextLang } = parsePath(window.location.pathname);
      await loadTranslations(nextLang);
      setLang(nextLang);

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

  const navigate = async (path, nextLang = lang) => {
    const normalized = path === "/" ? "/" : path.replace(/\/$/, "");

    await loadTranslations(nextLang);

    window.history.pushState({}, "", buildPath(normalized, nextLang));
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
        <Page t={t} lang={lang} navigate={navigate} service={service} />
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
