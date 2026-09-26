import { Clock3, Headphones, Mail, Phone, ShieldAlert } from "lucide-react";
import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF, OPERATIONS_EMAIL } from "../config";

export default function Contact({ t }) {
  const caseInfo = [
    t.CaseInfo1,
    t.CaseInfo2,
    t.CaseInfo3,
    t.CaseInfo4,
  ];

  return (
    <>
      <section className="page-hero contact-hero">
        <div className="container">
          <div className="eyebrow light"><span />{t.Availability}</div>
          <h1>{t.ContactTitle}</h1>
          <p>{t.ContactIntro}</p>
        </div>
      </section>

      <section className="section-pad emergency-contact-section">
        <div className="container">
          <div className="emergency-call-card">
            <div className="emergency-call-icon">
              <Phone size={34} aria-hidden="true" />
            </div>

            <div className="emergency-call-copy">
              <span className="emergency-label"><span className="pulse-dot" />{t.EmergencyLine}</span>
              <h2>{t.ContactCallTitle}</h2>
              <p>{t.ContactCallText}</p>
            </div>

            <a className="emergency-number" href={EMERGENCY_PHONE_HREF}>
              <small>{t.TapToCall}</small>
              <strong>{EMERGENCY_PHONE_DISPLAY}</strong>
              <span>{t.Availability}</span>
            </a>
          </div>

          <div className="row g-4 mt-2">
            <div className="col-lg-7">
              <div className="contact-prep-card">
                <div className="contact-prep-heading">
                  <Headphones size={25} aria-hidden="true" />
                  <div>
                    <span>{t.BeforeCallKicker}</span>
                    <h3>{t.BeforeCallTitle}</h3>
                  </div>
                </div>

                <p>{t.BeforeCallText}</p>

                <div className="case-info-grid">
                  {caseInfo.map((item, index) => (
                    <div key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <b>{item}</b>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="contact-secondary-card">
                <ShieldAlert size={27} aria-hidden="true" />
                <h3>{t.NoWaitTitle}</h3>
                <p>{t.NoWaitText}</p>

                <div className="contact-secondary-line">
                  <Clock3 size={19} aria-hidden="true" />
                  <span>{t.Availability}</span>
                </div>

                <div className="contact-secondary-line">
                  <Mail size={19} aria-hidden="true" />
                  <span>
                    <small>{t.NonUrgentOnly}</small>
                    <a href={`mailto:${OPERATIONS_EMAIL}`}>{OPERATIONS_EMAIL}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
