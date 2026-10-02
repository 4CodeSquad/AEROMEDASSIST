import { EMERGENCY_PHONE_DISPLAY, EMERGENCY_PHONE_HREF, OPERATIONS_EMAIL, SITE_NAME, SITE_URL } from "./config";
import { getTranslations, languageNames, supportedLanguages } from "./data/i18n";
import { serviceByPath, serviceContent, services } from "./data/services";
import { DEFAULT_LANGUAGE, NOT_FOUND, buildPath, pagePaths } from "./routes";

const pageKeys = { "/": "Home", "/about": "About", "/services": "Services", "/contact": "Contact" };
const ogLocales = { en: "en_US", sq: "sq_AL", it: "it_IT", de: "de_DE", fr: "fr_FR" };
const pageTypes = { "/about": "AboutPage", "/contact": "ContactPage" };
// Files whose last commit date becomes a page's sitemap <lastmod> (with the page's locale file).
// Add an entry when you add a page.
const pageSources = {
  "/": ["src/pages/Home.jsx"],
  "/about": ["src/pages/About.jsx"],
  "/services": ["src/pages/Services.jsx", "src/data/services.js"],
  "/contact": ["src/pages/Contact.jsx"],
};
const serviceSources = ["src/pages/ServicePage.jsx", "src/data/services.js"];
const telephone = EMERGENCY_PHONE_HREF.replace("tel:", "");
const allWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const orgId = `${SITE_URL}/#organization`;
const websiteId = `${SITE_URL}/#website`;

const absoluteUrl = (path) => `${SITE_URL}${path}`;
const pageUrl = (page, lang) => absoluteUrl(buildPath(page, lang));
const escapeHtml = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function getPageMeta(page, lang) {
  const t = getTranslations(lang);
  if (page === NOT_FOUND) return { title: `${t.NotFoundTitle} | ${SITE_NAME}`, description: t.NotFoundText };
  const service = serviceByPath[page];
  if (service) {
    const { name, text } = serviceContent(service, t);
    // TODO(client): keyword-led title/description per service once the target searches are confirmed.
    return { title: `${name} | ${SITE_NAME}`, description: text };
  }
  const key = pageKeys[page] || "Home";
  return { title: t[`Meta${key}Title`], description: t[`Meta${key}Description`] };
}

// Pages that are not ready for search (see src/data/services.js) get noindex and stay out of the sitemap.
export const isIndexable = (page) => serviceByPath[page]?.indexable ?? true;

function serviceNode(service, t, lang) {
  const { name, text } = serviceContent(service, t);
  const url = pageUrl(service.path, lang);
  return {
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    description: text,
    serviceType: service.serviceType,
    provider: { "@id": orgId },
    // TODO(client): confirm the real service area (countries/regions) and replace "Worldwide".
    areaServed: "Worldwide",
    availableChannel: { "@type": "ServiceChannel", servicePhone: { "@type": "ContactPoint", telephone }, availableLanguage: supportedLanguages },
    url,
  };
}

function structuredData(page, lang) {
  const t = getTranslations(lang);
  const { title, description } = getPageMeta(page, lang);
  const url = pageUrl(page, lang);
  const homeUrl = pageUrl("/", lang);
  const service = serviceByPath[page];

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
      ...(service && { mainEntity: { "@id": `${url}#service` } }),
    },
  ];

  if (page !== "/") {
    const crumbs = [[t.Home, homeUrl]];
    if (service) crumbs.push([t.Services, pageUrl("/services", lang)]);
    crumbs.push([service ? serviceContent(service, t).name : t[pageKeys[page]], url]);
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: crumbs.map(([name, item], index) => ({ "@type": "ListItem", position: index + 1, name, item })),
    });
  }

  if (page === "/services") {
    graph.push(...services.map((item) => serviceNode(item, t, lang)));
  }

  if (service) {
    graph.push(serviceNode(service, t, lang));
    const { faq } = serviceContent(service, t);
    if (faq.length) {
      graph.push({
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faq.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });
    }
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildHead(page, lang) {
  const { title, description } = getPageMeta(page, lang);
  const imageAlt = escapeHtml(getTranslations(lang).OgImageAlt);
  const url = pageUrl(page, lang);
  const image = `${SITE_URL}/og-image.png`;
  const jsonLd = JSON.stringify(structuredData(page, lang)).replace(/</g, "\\u003c");

  const tags = [
    `<meta name="robots" content="${isIndexable(page) ? "index, follow, max-image-preview:large" : "noindex, follow"}" />`,
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
    `<meta property="og:image:alt" content="${imageAlt}" />`,
    `<meta property="og:locale" content="${ogLocales[lang]}" />`,
    ...supportedLanguages
      .filter((code) => code !== lang)
      .map((code) => `<meta property="og:locale:alternate" content="${ogLocales[code]}" />`),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${imageAlt}" />`,
    `<script type="application/ld+json">${jsonLd}</script>`,
  ];

  return { title: escapeHtml(title), description: escapeHtml(description), head: tags.join("\n    ") };
}

export function pageSourceFiles(page, lang) {
  const files = serviceByPath[page] ? serviceSources : pageSources[page];
  if (!files) throw new Error(`No pageSources entry for ${page} in src/seo.js`);
  return [...files, `src/data/locales/${lang}.js`];
}

// lastmodFor(page, lang) returns YYYY-MM-DD, or null to leave <lastmod> out.
export function buildSitemap(lastmodFor) {
  const urls = supportedLanguages.flatMap((lang) =>
    pagePaths.filter(isIndexable).map((page) => {
      const alternates = [
        ...supportedLanguages.map((code) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${pageUrl(page, code)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(page, DEFAULT_LANGUAGE)}" />`,
      ].join("\n");
      const lastmod = lastmodFor(page, lang);
      return `  <url>\n    <loc>${pageUrl(page, lang)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>monthly</changefreq>\n    <priority>${page === "/" ? "1.0" : "0.8"}</priority>\n${alternates}\n  </url>`;
    }),
  );

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

export function buildRobots() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

// /llms.txt: a plain-text summary for AI assistants, built from the same copy and config as the pages.
export function buildLlmsTxt() {
  const t = getTranslations(DEFAULT_LANGUAGE);
  const link = (page) => {
    const { title, description } = getPageMeta(page, DEFAULT_LANGUAGE);
    return `- [${title}](${pageUrl(page, DEFAULT_LANGUAGE)}): ${description}`;
  };
  const corePages = ["/", "/services", "/about", "/contact"];

  return [
    `# ${SITE_NAME}`,
    "",
    `> ${t.MetaHomeDescription}`,
    "",
    t.HeroText,
    "",
    `- 24/7 emergency phone: ${EMERGENCY_PHONE_DISPLAY}`,
    `- Non-urgent email and documents: ${OPERATIONS_EMAIL}`,
    `- Urgent cases start by phone. ${t.NoWaitTitle}`,
    `- Languages: ${supportedLanguages.map((code) => languageNames[code]).join(", ")}`,
    // TODO(client): replace each line below with a confirmed fact, or delete it.
    "- TODO(client): head office address and country of registration",
    "- TODO(client): countries and regions served",
    "- TODO(client): whether AEROMED ASSIST operates its own aircraft and ambulances or coordinates partner providers",
    "- TODO(client): accreditations, insurer partnerships and founding year (only if confirmed and publishable)",
    "",
    "## Pages",
    "",
    ...corePages.filter(isIndexable).map(link),
    "",
    "## Services",
    "",
    ...services.map((service) => {
      const { name, text } = serviceContent(service, t);
      return service.indexable ? `- [${name}](${pageUrl(service.path, DEFAULT_LANGUAGE)}): ${text}` : `- ${name}: ${text}`;
    }),
    "",
    "## Other languages",
    "",
    ...supportedLanguages
      .filter((code) => code !== DEFAULT_LANGUAGE)
      .map((code) => `- [${languageNames[code]}](${pageUrl("/", code)})`),
    "",
  ].join("\n");
}

export const routes = supportedLanguages.flatMap((lang) => pagePaths.map((page) => ({ page, lang, path: buildPath(page, lang) })));
