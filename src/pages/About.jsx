import { Building2, Stethoscope, Users } from "lucide-react";
import Reveal from "../components/Reveal";

export default function About({ t }) {
  const support = [
    [Users, t.Support1, t.Support1Text],
    [Building2, t.Support2, t.Support2Text],
    [Stethoscope, t.Support3, t.Support3Text],
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="eyebrow light"><span />{t.AboutEyebrow}</div>
          <h1>{t.AboutTitle}</h1>
          <p>{t.AboutIntro}</p>
        </div>
      </section>

      <section className="section-pad about-story">
        <div className="container">
          <div className="row g-5 align-items-start">
            <div className="col-lg-6">
              <div className="eyebrow"><span />{t.AboutKicker}</div>
              <h2 className="display-sub">{t.AboutStatement}</h2>
            </div>
            <div className="col-lg-6">
              <p className="section-intro large">{t.AboutBody}</p>
              <p className="section-intro">{t.AboutBody2}</p>

              <div className="mini-stat-grid">
                <div><b>24/7</b><span>{t.Trust1}</span></div>
                <div><b>5</b><span>{t.AboutStat2}</span></div>
                <div><b>1</b><span>{t.AboutStat3}</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad support-section">
        <div className="container">
          <div className="row align-items-end mb-5">
            <div className="col-lg-7">
              <div className="eyebrow"><span />{t.SupportKicker}</div>
              <h2>{t.SupportTitle}</h2>
            </div>
            <div className="col-lg-4 ms-auto">
              <p className="section-intro">{t.SupportText}</p>
            </div>
          </div>

          <div className="row g-4">
            {support.map(([Icon, title, text]) => (
              <div className="col-md-6 col-lg-4" key={title}>
                <Reveal className="support-card">
                  <div className="support-icon"><Icon size={22} aria-hidden="true" /></div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
