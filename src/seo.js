import { EMERGENCY_PHONE_HREF, OPERATIONS_EMAIL, SITE_NAME, SITE_URL } from "./config";
import { getTranslations, supportedLanguages } from "./data/i18n";
import { DEFAULT_LANGUAGE, buildPath, pagePaths } from "./routes";

const pageKeys = { "/": "Home", "/about": "About", "/services": "Services", "/contact": "Contact" };
const ogLocales = { en: "en_US", sq: "sq_AL", it: "it_IT", de: "de_DE", fr: "fr_FR" };
const pageTypes = { "/about": "AboutPage", "/contact": "ContactPage" };
const telephone = EMERGENCY_PHONE_HREF.replace("tel:", "");
const allWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const absoluteUrl = (path) => `${SITE_URL}${path}`;
const pageUrl = (page, lang) => absoluteUrl(buildPath(page, lang));
const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function getPageMeta(page, lang) {
  const t = getTranslations(lang);
  const key = pageKeys[page] || "Home";
  return { title: t[`Meta${key}Title`], description: t[`Meta${key}Description`] };
}

function structuredData(page, lang) {
  const t = getTranslations(lang);
  const { title, description } = getPageMeta(page, lang);
  const url = pageUrl(page, lang);
  const homeUrl = pageUrl("/", lang);
  const orgId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/aeromed-logo.png`, width: 631, height: 316 },
      image: `${SITE_URL}/og-image.png`,
      description: getTranslations(DEFAULT_LANGUAGE).MetaHomeDescription,
      email: OPERATIONS_EMAIL,
      telephone,
      areaServed: "Worldwide",
      knowsLanguage: supportedLanguages,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone,
          contactType: "emergency",
          areaServed: "Worldwide",
          availableLanguage: supportedLanguages,
          hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: allWeek, opens: "00:00", closes: "23:59" },
        },
        { "@type": "ContactPoint", email: OPERATIONS_EMAIL, contactType: "customer service", availableLanguage: supportedLanguages },
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": orgId },
      inLanguage: supportedLanguages,
    },
    {
      "@type": pageTypes[page] || "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: lang,
      isPartOf: { "@id": websiteId },
      about: { "@id": orgId },
      primaryImageOfPage: `${SITE_URL}/og-image.png`,
      ...(page !== "/" && { breadcrumb: { "@id": `${url}#breadcrumb` } }),
    },
  ];

  if (page !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.Home, item: homeUrl },
        { "@type": "ListItem", position: 2, name: t[pageKeys[page]], item: url },
      ],
    });
  }

  if (page === "/services") {
    [
      [t.AirAmbulance, t.AirAmbulanceText, "Air ambulance"],
      [t.MedicalEscort, t.MedicalEscortText, "Medical escort"],
      [t.Repatriation, t.RepatriationText, "Medical repatriation"],
      [t.GroundAmbulance, t.GroundAmbulanceText, "Ground ambulance"],
    ].forEach(([name, serviceDescription, serviceType]) => {
      graph.push({
        "@type": "Service",
        name,
        description: serviceDescription,
        serviceType,
        provider: { "@id": orgId },
        areaServed: "Worldwide",
        availableChannel: { "@type": "ServiceChannel", servicePhone: { "@type": "ContactPoint", telephone }, availableLanguage: supportedLanguages },
        url,
      });
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildHead(page, lang) {
  const { title, description } = getPageMeta(page, lang);
  const url = pageUrl(page, lang);
  const image = `${SITE_URL}/og-image.png`;
  const jsonLd = JSON.stringify(structuredData(page, lang)).replace(/</g, "\\u003c");

  const tags = [
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<link rel="canonical" href="${url}" />`,
    ...supportedLanguages.map((code) => `<link rel="alternate" hreflang="${code}" href="${pageUrl(page, code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(page, DEFAULT_LANGUAGE)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="${ogLocales[lang]}" />`,
    ...supportedLanguages
      .filter((code) => code !== lang)
      .map((code) => `<meta property="og:locale:alternate" content="${ogLocales[code]}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ];

  return { title: escapeHtml(title), description: escapeHtml(description), head: tags.join("\n    ") };
}

export function buildSitemap(lastmod) {
  const urls = supportedLanguages.flatMap((lang) =>
    pagePaths.map((page) => {
      const alternates = [
        ...supportedLanguages.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${pageUrl(page, code)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page, DEFAULT_LANGUAGE)}" />`,
      ].join("\n");
      return `  <url>\n    <loc>${pageUrl(page, lang)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${page === "/" ? "1.0" : "0.8"}</priority>\n${alternates}\n  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export const routes = supportedLanguages.flatMap((lang) => pagePaths.map((page) => ({ page, lang, path: buildPath(page, lang) })));
