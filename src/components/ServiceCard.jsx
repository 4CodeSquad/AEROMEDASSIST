import { ArrowRight } from "lucide-react";
import { serviceContent } from "../data/services";
import NavLink from "./NavLink";
import Reveal from "./Reveal";

// The service name is the link (descriptive anchor text); it stretches over the whole card.
export default function ServiceCard({ service, number, t, lang, navigate }) {
  const { name, text } = serviceContent(service, t);
  const Icon = service.icon;

  return (
    <Reveal as="article" className="service-card">
      <div className="card-no">{number}</div>
      <div className="service-icon"><Icon aria-hidden="true" /></div>
      <h3>
        <NavLink to={service.path} lang={lang} navigate={navigate} className="card-title-link">{name}</NavLink>
      </h3>
      <p>{text}</p>
      <span className="card-link" aria-hidden="true"><ArrowRight size={17} /></span>
    </Reveal>
  );
}
