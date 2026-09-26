import { Phone, ShieldCheck } from "lucide-react";
import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF } from "../config";

export default function EmergencyBar({ t }) {
  return (
    <div className="mobile-emergency-bar d-lg-none">
      <div className="mobile-emergency-status">
        <ShieldCheck size={17} aria-hidden="true" />
        <span>{t.Availability}</span>
      </div>
      <a className="mobile-emergency-call" href={EMERGENCY_PHONE_HREF}>
        <Phone size={18} aria-hidden="true" />
        <span>{t.CallNow}</span>
        <strong>{EMERGENCY_PHONE_DISPLAY}</strong>
      </a>
    </div>
  );
}
