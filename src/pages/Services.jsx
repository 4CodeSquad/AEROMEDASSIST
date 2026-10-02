import { useState } from "react";
import { ArrowRight, Check, Phone, Plus } from "lucide-react";
import NavLink from "../components/NavLink";
import Reveal from "../components/Reveal";
import { EMERGENCY_PHONE_HREF } from "../config";
import { serviceContent, services as serviceList } from "../data/services";

export default function Services({ t, lang, navigate }) {
  const [openIndex, setOpenIndex] = useState(0);

  const services = serviceList.map((service, index) => {
    const { name, text, tag, details } = serviceContent(service, t);
    return [String(index + 1).padStart(2, "0"), name, text, tag, details, service.path];
  });

  const toggle = (index) => setOpenIndex((current) => (current === index ? -1 : index));

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow light"><span />{t.ServicesKicker}</div>
          <h1>{t.ServicesPageTitle}</h1>
          <p>{t.ServicesPageIntro}</p>
          <a className="btn btn-brand btn-lg mt-3" href={EMERGENCY_PHONE_HREF}>
            <Phone size={18} aria-hidden="true" />
            {t.CallNow}
          </a>
        </div>
      </section>

      <section className="section-pad">
        <div className="container services-stack">
          {services.map(([number, title, text, tag, details, path], index) => {
            const open = openIndex === index;
            const detailsId = `service-details-${number}`;

            return (
              <Reveal as="article" className={`service-row ${open ? "is-open" : ""}`} key={number}>
                <span className="service-index">{number}</span>
                <div className="service-body" onClick={() => toggle(index)}>
                  <small>{tag}</small>
                  <h2>{title}</h2>
                  <p>{text}</p>
                  <NavLink to={path} lang={lang} navigate={navigate} className="service-page-link">
                    {t.LearnMore}: {title}
                    <ArrowRight size={16} aria-hidden="true" />
                  </NavLink>
                </div>
                <button
                  type="button"
                  className="service-symbol"
                  aria-expanded={open}
                  aria-controls={detailsId}
                  aria-label={`${open ? t.HideDetails : t.ShowDetails}: ${title}`}
                  onClick={() => toggle(index)}
                >
                  <Plus aria-hidden="true" />
                </button>
                <div className="service-details" id={detailsId} aria-hidden={!open}>
                  <div className="service-details-inner">
                    <span className="service-details-label">{t.ServiceDetailsLabel}</span>
                    <ul>
                      {details.map((item) => (
                        <li key={item}>
                          <Check size={16} aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            );
          })}
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
