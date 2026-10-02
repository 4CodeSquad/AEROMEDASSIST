import { Ambulance, Globe2, Plane, Stethoscope } from "lucide-react";

// Single source for the four services: routes, the Services page, the home cards,
// each /services/<slug> page and its JSON-LD all read from here.
//
// Copy comes from the locale files using the service's `key`:
//   <key>, <key>Text, <key>Detail1..3, plus the tag in `tagKey`.
//
// TODO(client): these pages only repeat what /services already says. Until the client's
// answers arrive they are `noindex, follow` and left out of the sitemap (indexable: false).
// To launch a service page:
//   1. add real, client-confirmed copy (who it is for, coverage, timing, how booking works);
//   2. add FAQ entries: put "<key>Faq1Question"/"<key>Faq1Answer" (etc.) in every locale and
//      list the prefixes in `faq`, e.g. faq: ["AirAmbulanceFaq1"]. They render on the page
//      and as FAQPage JSON-LD. Never publish an answer the client has not confirmed;
//   3. set indexable: true.
export const services = [
  { slug: "air-ambulance", key: "AirAmbulance", tagKey: "ServiceTagAir", serviceType: "Air ambulance", icon: Plane },
  { slug: "medical-escort", key: "MedicalEscort", tagKey: "ServiceTagEscort", serviceType: "Medical escort", icon: Stethoscope },
  { slug: "repatriation", key: "Repatriation", tagKey: "ServiceTagRepatriation", serviceType: "Medical repatriation", icon: Globe2 },
  { slug: "ground-ambulance", key: "GroundAmbulance", tagKey: "ServiceTagGround", serviceType: "Ground ambulance", icon: Ambulance },
].map((service) => ({ ...service, path: `/services/${service.slug}`, faq: [], indexable: false }));

export const serviceByPath = Object.fromEntries(services.map((service) => [service.path, service]));

export function serviceContent(service, t) {
  return {
    name: t[service.key],
    text: t[`${service.key}Text`],
    tag: t[service.tagKey],
    details: [1, 2, 3].map((n) => t[`${service.key}Detail${n}`]),
    faq: service.faq.map((prefix) => ({ question: t[`${prefix}Question`], answer: t[`${prefix}Answer`] })),
  };
}
