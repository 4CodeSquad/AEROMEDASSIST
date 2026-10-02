import { Check, Phone } from "lucide-react";
import NavLink from "../components/NavLink";
import ServiceCard from "../components/ServiceCard";
import { EMERGENCY_PHONE_HREF } from "../config";
import { serviceContent, services } from "../data/services";

export default function ServicePage({ t, lang, navigate, service }) {
  const { name, text, tag, details, faq } = serviceContent(service, t);
  const linkProps = { lang, navigate };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb-trail" aria-label={t.Breadcrumb}>
            <ol>
              <li><NavLink to="/" {...linkProps}>{t.Home}</NavLink></li>
              <li><NavLink to="/services" {...linkProps}>{t.Services}</NavLink></li>
              <li aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="eyebrow light"><span />{tag}</div>
          <h1>{name}</h1>
          <p>{text}</p>
          <a className="btn btn-brand btn-lg mt-3" href={EMERGENCY_PHONE_HREF}>
            <Phone size={18} aria-hidden="true" />
            {t.CallNow}
          </a>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          <div className="eyebrow"><span />{tag}</div>
          <h2>{t.ServiceDetailsLabel}</h2>
          <ul className="service-detail-list">
            {details.map((item) => (
              <li key={item}>
                <Check size={18} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {faq.length > 0 && (
        <section className="section-pad pt-0">
          <div className="container">
            <h2>{t.FaqTitle}</h2>
            <div className="faq-list">
              {faq.map(({ question, answer }) => (
                <div className="faq-item" key={question}>
                  <h3>{question}</h3>
                  <p>{answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-pad pt-0">
        <div className="container">
          <h2 className="mb-5">{t.OtherServices}</h2>
          <div className="row g-4">
            {services.filter((other) => other !== service).map((other) => (
              <div className="col-md-6 col-xl-4" key={other.slug}>
                <ServiceCard
                  service={other}
                  number={String(services.indexOf(other) + 1).padStart(2, "0")}
                  t={t}
                  lang={lang}
                  navigate={navigate}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-wrap pt-0">
        <div className="container">
          <div className="cta-card">
            <div>
              <div className="eyebrow light"><span />{t.CtaKicker}</div>
              <h2>{t.CtaTitle}</h2>
              <p>{t.CtaText}</p>
            </div>
            <a className="btn btn-light btn-lg" href={EMERGENCY_PHONE_HREF}>
              <Phone size={18} aria-hidden="true" />
              {t.CallNow}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
