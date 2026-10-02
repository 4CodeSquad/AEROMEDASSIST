import { Phone, Mail } from "lucide-react";
import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF, OPERATIONS_EMAIL } from "../config";
import Logo from "./Logo";
import NavLink from "./NavLink";

export default function Footer({ t, lang, page, navigate }) {
  const linkProps = { lang, navigate, current: page, className: "footer-link" };

  return (
    <footer className="footer-main">
      <div className="container">
        <div className="row g-5 py-5">
          <div className="col-lg-5">
            <Logo className="footer-logo" lazy />
            <p className="footer-copy">{t.FooterText}</p>
            <div className="availability"><span />{t.Availability}</div>
          </div>

          <div className="col-6 col-lg-2 ms-lg-auto">
            <h2 className="footer-heading">{t.QuickLinks}</h2>
            <NavLink to="/about" {...linkProps}>{t.About}</NavLink>
            <NavLink to="/services" {...linkProps}>{t.Services}</NavLink>
            <NavLink to="/contact" {...linkProps}>{t.Contact}</NavLink>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <h2 className="footer-heading">{t.EmergencyContact}</h2>
            <a className="footer-contact" href={EMERGENCY_PHONE_HREF}>
              <Phone size={16} aria-hidden="true" />
              <span>
                <small>{t.CallNow}</small>
                {EMERGENCY_PHONE_DISPLAY}
              </span>
            </a>
            <a className="footer-contact" href={`mailto:${OPERATIONS_EMAIL}`}>
              <Mail size={16} aria-hidden="true" />
              <span>
                <small>{t.NonUrgentEmail}</small>
                {OPERATIONS_EMAIL}
              </span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AEROMED ASSIST</span>
          <span>{t.FooterBottom}</span>
          <a className="footer-credit" href="https://www.4cs.al/" target="_blank" rel="noopener noreferrer">
            {t.DevelopedBy} <strong>4CS</strong>
          </a>
        </div>
      </div>
    </footer>
  );
}
