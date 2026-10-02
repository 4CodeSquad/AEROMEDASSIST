import { Ambulance, ArrowRight, CheckCircle2, Phone, Plane, ShieldCheck, Stethoscope, Route, Globe2 } from "lucide-react";
import PlaneArt from "../components/PlaneArt";
import Reveal from "../components/Reveal";
import NavLink from "../components/NavLink";
import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF } from "../config";

export default function Home({ t, lang, navigate }) {
  const services = [
    [t.AirAmbulance, t.AirAmbulanceText, "01", Plane],
    [t.MedicalEscort, t.MedicalEscortText, "02", Stethoscope],
    [t.Repatriation, t.RepatriationText, "03", Globe2],
    [t.GroundAmbulance, t.GroundAmbulanceText, "04", Ambulance],
  ];

  const process = [
    [t.Step1, t.Step1Text],
    [t.Step2, t.Step2Text],
    [t.Step3, t.Step3Text],
    [t.Step4, t.Step4Text],
  ];

  const why = [
    ["01", t.Why1, t.Why1Text],
    ["02", t.Why2, t.Why2Text],
    ["03", t.Why3, t.Why3Text],
    ["04", t.Why4, t.Why4Text],
  ];

  const journey = [
    [t.Journey1, Stethoscope],
    [t.Journey2, Route],
    [t.Journey3, Globe2],
    [t.Journey4, ShieldCheck],
  ];

  return (
    <>
      <section className="hero">
        <div className="hero-grid" />
        <div className="route-line route-a" />
        <div className="route-line route-b" />
        <PlaneArt />

        <div className="container hero-content">
          <div className="row align-items-center">
            <div className="col-xl-8 col-lg-9">
              <div className="eyebrow light"><span />{t.Eyebrow}</div>
              <h1>{t.HeroTitle}</h1>
              <p className="hero-lead">{t.HeroText}</p>

              <div className="d-flex flex-wrap gap-3 hero-actions">
                <a className="btn btn-brand btn-lg" href={EMERGENCY_PHONE_HREF}>
                  <Phone size={18} aria-hidden="true" />
                  {t.PrimaryCta}
                </a>
                <a className="btn btn-ghost-light btn-lg" href="#process">{t.SecondaryCta}</a>
              </div>

              <div className="hero-phone-line d-lg-none">
                <span>{t.ImmediateHelp}</span>
                <strong>{EMERGENCY_PHONE_DISPLAY}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-trust">
          <div className="container">
            <div className="trust-grid">
              <div><b>24/7</b><span>{t.Trust1}</span></div>
              <div><b>{t.TrustGlobalLabel}</b><span>{t.Trust2}</span></div>
              <div><b>{t.TrustBedLabel}</b><span>{t.Trust3}</span></div>
              <div><b>{t.TrustFastLabel}</b><span>{t.Trust4}</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="urgent-strip">
        <div className="container urgent-strip-inner">
          <div>
            <span className="pulse-dot" />
            <div>
              <b>{t.UrgentTitle}</b>
              <small>{t.UrgentText}</small>
            </div>
          </div>
          <a href={EMERGENCY_PHONE_HREF}>
            <Phone size={18} aria-hidden="true" />
            {t.CallNow}
          </a>
        </div>
      </section>

      <section className="section-pad services-home">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-lg-7">
              <div className="eyebrow"><span />{t.ServicesKicker}</div>
              <h2>{t.ServicesTitle}</h2>
            </div>
            <div className="col-lg-4 ms-auto"><p className="section-intro">{t.ServicesText}</p></div>
          </div>

          <div className="row g-4">
            {services.map(([title, text, number, Icon]) => (
              <div className="col-md-6 col-xl-3" key={number}>
                <Reveal as="article" className="service-card">
                  <div className="card-no">{number}</div>
                  <div className="service-icon"><Icon aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <NavLink to="/services" lang={lang} navigate={navigate} className="card-link" aria-label={`${t.LearnMore}: ${title}`}>
                    <ArrowRight size={17} aria-hidden="true" />
                  </NavLink>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="process section-pad" id="process">
        <div className="container">
          <div className="row mb-5">
            <div className="col-lg-8">
              <div className="eyebrow light"><span />{t.ProcessKicker}</div>
              <h2>{t.ProcessTitle}</h2>
              <p className="process-intro">{t.ProcessIntro}</p>
            </div>
          </div>
          <div className="process-line" />
          <div className="row g-4 process-row">
            {process.map(([title, text]) => (
              <div className="col-md-6 col-xl-3" key={title}>
                <Reveal className="process-card">
                  <i />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad journey-section">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-lg-7">
              <div className="eyebrow"><span />{t.JourneyKicker}</div>
              <h2>{t.JourneyTitle}</h2>
            </div>
            <div className="col-lg-4 ms-auto">
              <p className="section-intro">{t.JourneyText}</p>
            </div>
          </div>

          <div className="journey-track">
            {journey.map(([label, Icon], index) => (
              <Reveal className="journey-step" key={label}>
                <div className="journey-icon"><Icon size={23} aria-hidden="true" /></div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{label}</h3>
                {index < journey.length - 1 && <ArrowRight className="journey-arrow" size={20} aria-hidden="true" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad why">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-5">
              <div className="eyebrow"><span />{t.WhyKicker}</div>
              <h2>{t.WhyTitle}</h2>
              <p className="section-intro large">{t.WhyText}</p>

              <div className="trust-badge">
                <CheckCircle2 size={22} aria-hidden="true" />
                <div>
                  <b>{t.TrustBadgeTitle}</b>
                  <span>{t.TrustBadgeText}</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 ms-auto">
              <div className="why-list">
                {why.map(([number, title, text]) => (
                  <Reveal className="why-item" key={number}>
                    <span>{number}</span>
                    <div><h3>{title}</h3><p>{text}</p></div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="global-panel">
        <div className="container">
          <div className="global-card">
            <div className="world-lines" />
            <div className="row align-items-center position-relative">
              <div className="col-lg-6">
                <div className="eyebrow light"><span />{t.GlobalKicker}</div>
                <h2>{t.GlobalTitle}</h2>
                <p>{t.GlobalText}</p>
                <NavLink to="/about" lang={lang} navigate={navigate} className="btn btn-light mt-3">{t.LearnMore}</NavLink>
              </div>
              <div className="col-lg-5 ms-auto">
                <div className="globe">
                  <span className="globe-orbit o1" />
                  <span className="globe-orbit o2" />
                  <span className="globe-core">+</span>
                  <span className="globe-dot d1" />
                  <span className="globe-dot d2" />
                  <span className="globe-dot d3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-wrap">
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
