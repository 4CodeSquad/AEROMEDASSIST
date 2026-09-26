import { useState } from "react";
import { Check, Phone, Plus } from "lucide-react";
import Reveal from "../components/Reveal";
import { EMERGENCY_PHONE_HREF } from "../config";

export default function Services({ t }) {
  const [openIndex, setOpenIndex] = useState(0);

  const services = [
    ["01", t.AirAmbulance, t.AirAmbulanceText, t.ServiceTagAir, [t.AirAmbulanceDetail1, t.AirAmbulanceDetail2, t.AirAmbulanceDetail3]],
    ["02", t.MedicalEscort, t.MedicalEscortText, t.ServiceTagEscort, [t.MedicalEscortDetail1, t.MedicalEscortDetail2, t.MedicalEscortDetail3]],
    ["03", t.Repatriation, t.RepatriationText, t.ServiceTagRepatriation, [t.RepatriationDetail1, t.RepatriationDetail2, t.RepatriationDetail3]],
    ["04", t.GroundAmbulance, t.GroundAmbulanceText, t.ServiceTagGround, [t.GroundAmbulanceDetail1, t.GroundAmbulanceDetail2, t.GroundAmbulanceDetail3]],
  ];

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
          {services.map(([number, title, text, tag, details], index) => {
            const open = openIndex === index;
            const detailsId = `service-details-${number}`;

            return (
              <Reveal as="article" className={`service-row ${open ? "is-open" : ""}`} key={number}>
                <span className="service-index">{number}</span>
                <div className="service-body" onClick={() => toggle(index)}>
                  <small>{tag}</small>
                  <h2>{title}</h2>
                  <p>{text}</p>
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
