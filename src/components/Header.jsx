import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { supportedLanguages, translations } from "../data/translations";
import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF } from "../config";
import Logo from "./Logo";
import NavLink from "./NavLink";

export default function Header({ t, lang, page, navigate, changeLanguage }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenus = () => {
    setMenuOpen(false);
    setLanguageOpen(false);
  };

  const linkProps = { lang, navigate, current: page, onNavigate: closeMenus };

  return (
    <>
      <div className="topline d-none d-lg-block">
        <div className="container d-flex justify-content-between align-items-center">
          <span>{t.ToplineText}</span>
          <a href={EMERGENCY_PHONE_HREF} className="topline-call">
            <span className="topline-status">
              <i />
              {t.Availability}
            </span>
            <strong>{EMERGENCY_PHONE_DISPLAY}</strong>
          </a>
        </div>
      </div>

      <header className={`site-header ${scrolled ? "scrolled" : ""}`} id="siteHeader">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <NavLink to="/" className="navbar-brand brand-button" {...linkProps} current={undefined}>
              <Logo />
            </NavLink>

            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              aria-label={t.ToggleNavigation}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
              <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
                <li className="nav-item"><NavLink to="/" className="nav-link" {...linkProps}>{t.Home}</NavLink></li>
                <li className="nav-item"><NavLink to="/about" className="nav-link" {...linkProps}>{t.About}</NavLink></li>
                <li className="nav-item"><NavLink to="/services" className="nav-link" {...linkProps}>{t.Services}</NavLink></li>
                <li className="nav-item"><NavLink to="/contact" className="nav-link" {...linkProps}>{t.Contact}</NavLink></li>
              </ul>

              <div className="language-wrap ms-lg-3 my-3 my-lg-0">
                <button
                  className="language-btn"
                  onClick={() => setLanguageOpen((value) => !value)}
                  aria-expanded={languageOpen}
                >
                  {lang.toUpperCase()} <span className="language-caret">▾</span>
                </button>

                {languageOpen && (
                  <div className="language-menu-react">
                    {supportedLanguages.map((code) => (
                      <button
                        key={code}
                        className={code === lang ? "active" : ""}
                        onClick={() => {
                          changeLanguage(code);
                          setLanguageOpen(false);
                          setMenuOpen(false);
                        }}
                      >
                        <span>{code.toUpperCase()}</span>
                        {translations[code].LanguageName}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <a className="btn btn-brand ms-lg-3 header-call" href={EMERGENCY_PHONE_HREF}>
                <Phone size={16} aria-hidden="true" />
                {t.CallNow}
              </a>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
