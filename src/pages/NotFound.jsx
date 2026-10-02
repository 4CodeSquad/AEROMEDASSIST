import { ArrowRight, Phone } from "lucide-react";
import NavLink from "../components/NavLink";
import { EMERGENCY_PHONE_HREF } from "../config";
import { serviceContent, services } from "../data/services";

export default function NotFound({ t, lang, navigate }) {
  const links = [
    ["/", t.Home],
    ["/services", t.Services],
    ...services.map((service) => [service.path, serviceContent(service, t).name]),
    ["/about", t.About],
    ["/contact", t.Contact],
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow light"><span />404</div>
          <h1>{t.NotFoundTitle}</h1>
          <p>{t.NotFoundText}</p>
          <a className="btn btn-brand btn-lg mt-3" href={EMERGENCY_PHONE_HREF}>
            <Phone size={18} aria-hidden="true" />
            {t.CallNow}
          </a>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <h2 className="mb-4">{t.NotFoundLinks}</h2>
          <ul className="not-found-links">
            {links.map(([to, label]) => (
              <li key={to}>
                <NavLink to={to} lang={lang} navigate={navigate}>
                  {label}
                  <ArrowRight size={16} aria-hidden="true" />
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
