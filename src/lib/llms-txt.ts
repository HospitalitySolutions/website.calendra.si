import { getArticlesForLanguage, getBlogArticlePath } from "@/lib/blog";
import { getFaqForRoute } from "@/lib/faq";
import { getIndustryContent, INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { canonicalRoutes, type CanonicalRouteKey } from "@/lib/localized-routes";
import { getInitialPricingCatalog } from "@/lib/public-pricing";
import { absoluteUrl, AUTHOR, pageSeo } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import type { SiteLanguage } from "@/lib/site-language";

type RouteGroup = {
  heading: Record<SiteLanguage, string>;
  routeKeys: CanonicalRouteKey[];
};

/**
 * Groups drive the llms.txt outline. Every canonical route must appear in
 * exactly one group; `assertRouteCoverage` below fails the build otherwise, so
 * a newly added page cannot silently go missing from the AI-facing index.
 */
const routeGroups: RouteGroup[] = [
  {
    heading: { sl: "Glavne strani", en: "Core pages" },
    routeKeys: ["home", "pricing", "booking", "customers", "businesses", "customerStories", "demo", "contact", "support"],
  },
  {
    heading: { sl: "Funkcionalnosti", en: "Product features" },
    routeKeys: ["calendar", "invoicing", "clientManagement", "reminders", "integrations", "materialManagement", "zoom"],
  },
  {
    heading: { sl: "Rešitve po dejavnostih", en: "Solutions by industry" },
    routeKeys: [...INDUSTRY_ROUTE_KEYS],
  },
  {
    heading: { sl: "Mobilna aplikacija za stranke", en: "Customer mobile app" },
    routeKeys: ["connect"],
  },
  {
    heading: { sl: "IT storitve za mala podjetja", en: "IT services for small businesses" },
    routeKeys: ["itServices", ...IT_SERVICE_ROUTE_KEYS],
  },
  {
    heading: { sl: "Nasveti in vodniki", en: "Guides and advice" },
    routeKeys: ["blog", "author"],
  },
  {
    heading: { sl: "Pravno in zaupanje", en: "Legal and trust" },
    routeKeys: [
      "legal",
      "privacy",
      "terms",
      "dpa",
      "subprocessors",
      "cookies",
      "security",
      "dataRights",
      "aiTransparency",
      "accountDeletion",
    ],
  },
];

const allRouteKeys = Object.keys(canonicalRoutes) as CanonicalRouteKey[];

const assertRouteCoverage = () => {
  const grouped = routeGroups.flatMap((group) => group.routeKeys);
  const missing = allRouteKeys.filter((key) => !grouped.includes(key));
  if (missing.length > 0) {
    throw new Error(`llms.txt route groups are missing: ${missing.join(", ")}. Add them to routeGroups.`);
  }

  const duplicates = grouped.filter((key, index) => grouped.indexOf(key) !== index);
  if (duplicates.length > 0) {
    throw new Error(`llms.txt route groups contain duplicates: ${duplicates.join(", ")}.`);
  }
};

const formatPrice = (value: number) => `${value.toFixed(2).replace(".", ",")} EUR`;

const planSummary = (language: SiteLanguage) =>
  getInitialPricingCatalog()
    .plans.map((plan) => `${language === "sl" ? plan.nameSl : plan.name} ${formatPrice(plan.monthlyGross)}${language === "sl" ? "/mesec" : "/month"}`)
    .join(", ");

const summary: Record<SiteLanguage, string> = {
  sl: [
    `Calendra je slovenska spletna platforma (SaaS) za storitvena podjetja. Združuje spletno naročanje strank, koledar terminov, upravljanje strank, SMS in e-poštne opomnike, izdajo računov, plačila, analitiko ter materialno poslovanje na enem mestu.`,
    `Namenjena je frizerskim in kozmetičnim salonom, wellness in zdravstvenim izvajalcem, fitnes in skupinskim programom, svetovalcem, izobraževalcem ter drugim storitvenim podjetjem in samostojnim podjetnikom v Sloveniji.`,
    `Ponudnik je ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}. Kontakt: ${LEGAL.generalEmail}, ${LEGAL.supportPhone}. Aplikacija je na voljo v slovenščini in angleščini.`,
  ].join("\n\n"),
  en: [
    `Calendra is a Slovenian SaaS platform for service businesses. It combines online appointment booking, an appointment calendar, client management, SMS and email reminders, invoicing, payments, analytics and inventory management in one place.`,
    `It serves hair and beauty salons, wellness and health providers, fitness and group programmes, consultants, educators and other service businesses and sole traders in Slovenia.`,
    `The provider is ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}. Contact: ${LEGAL.generalEmail}, ${LEGAL.supportPhone}. The product is available in Slovenian and English.`,
  ].join("\n\n"),
};

const keyFacts = (language: SiteLanguage) => {
  const catalog = getInitialPricingCatalog();

  return language === "sl"
    ? [
        `Paketi: ${planSummary("sl")} (cene z DDV, en uporabnik vključen).`,
        `Letno plačilo: plačate ${catalog.annualBilledMonths} mesecev za 12 mesecev uporabe.`,
        `Dodatni uporabniki: od ${formatPrice(catalog.additionalUserRules[0].monthlyGrossPerUser)} na uporabnika mesečno.`,
        `Brezplačni preizkus: 14 dni, brez kreditne kartice.`,
        `Jeziki: slovenščina in angleščina. Valuta: EUR. Trg: Slovenija.`,
        `Mobilna aplikacija za končne stranke: Calendra Connect (brezplačna, iOS in Android).`,
        `Gostovanje in obdelava podatkov: EU regija, skladno z GDPR.`,
      ]
    : [
        `Plans: ${planSummary("en")} (VAT included, one user included).`,
        `Annual billing: pay for ${catalog.annualBilledMonths} months and use the product for 12.`,
        `Additional users: from ${formatPrice(catalog.additionalUserRules[0].monthlyGrossPerUser)} per user per month.`,
        `Free trial: 14 days, no credit card required.`,
        `Languages: Slovenian and English. Currency: EUR. Market: Slovenia.`,
        `Customer mobile app: Calendra Connect (free, iOS and Android).`,
        `Hosting and data processing: EU region, GDPR compliant.`,
      ];
};

const routeLine = (routeKey: CanonicalRouteKey, language: SiteLanguage) => {
  const seo = pageSeo[routeKey][language];
  const label = seo.title.split("|")[0].trim();
  return `- [${label}](${absoluteUrl(canonicalRoutes[routeKey][language])}): ${seo.description}`;
};

const articleLines = (language: SiteLanguage) => {
  const articles = getArticlesForLanguage(language);
  if (articles.length === 0) return [];

  return [
    "",
    `### ${language === "sl" ? "Članki" : "Articles"}`,
    "",
    ...articles.map(
      (article) =>
        `- [${article.title}](${absoluteUrl(getBlogArticlePath(article.slug, language))}): ${article.description}`,
    ),
  ];
};


/**
 * llms.txt is the emerging convention for giving language models a curated,
 * markdown-shaped map of a site instead of making them infer structure from
 * navigation. Generated from the same registries that build the sitemap so the
 * two can never disagree.
 */
export const buildLlmsTxt = () => {
  assertRouteCoverage();

  const sections: string[] = [
    "# Calendra",
    "",
    `> ${summary.sl.split("\n\n")[0]}`,
    "",
    summary.sl,
    "",
    "## Ključna dejstva",
    "",
    ...keyFacts("sl").map((fact) => `- ${fact}`),
    "",
    `Avtor vsebin: ${AUTHOR.name}, ${AUTHOR.jobTitle.sl}.`,
    "",
    "---",
    "",
    "## Slovenske strani",
  ];

  for (const group of routeGroups) {
    sections.push("", `### ${group.heading.sl}`, "");
    sections.push(...group.routeKeys.map((routeKey) => routeLine(routeKey, "sl")));
  }

  sections.push(...articleLines("sl"));

  sections.push("", "---", "", "# Calendra (English)", "", summary.en, "", "## Key facts", "");
  sections.push(...keyFacts("en").map((fact) => `- ${fact}`));
  sections.push("", "## English pages");

  for (const group of routeGroups) {
    sections.push("", `### ${group.heading.en}`, "");
    sections.push(...group.routeKeys.map((routeKey) => routeLine(routeKey, "en")));
  }

  sections.push(...articleLines("en"));

  sections.push(
    "",
    "---",
    "",
    "## Optional",
    "",
    `- [Sitemap](${SITE_URL}/sitemap.xml): every indexable URL with hreflang alternates.`,
    `- [Full text export](${SITE_URL}/llms-full.txt): flattened prose of the main product pages.`,
    "",
  );

  return sections.join("\n");
};

const industrySection = (language: SiteLanguage) =>
  INDUSTRY_ROUTE_KEYS.map((routeKey) => {
    const industry = getIndustryContent(routeKey, language);
    return [
      `### ${industry.title}`,
      "",
      `URL: ${absoluteUrl(canonicalRoutes[routeKey][language])}`,
      "",
      industry.intro,
      "",
      `${language === "sl" ? "Za koga" : "Who it is for"}: ${industry.audiences.join("; ")}.`,
      "",
      ...industry.features.map((feature) => `- ${feature.title}: ${feature.description}`),
    ].join("\n");
  }).join("\n\n");

const itServiceSection = (language: SiteLanguage) =>
  IT_SERVICE_ROUTE_KEYS.map((routeKey) => {
    const service = getItServiceContent(routeKey, language);
    return [
      `### ${service.title}`,
      "",
      `URL: ${absoluteUrl(canonicalRoutes[routeKey][language])}`,
      "",
      service.intro,
      "",
      ...service.deliverables.map((item) => `- ${item}`),
    ].join("\n");
  }).join("\n\n");

const faqSection = (language: SiteLanguage) => {
  const blocks: string[] = [];

  for (const group of routeGroups) {
    for (const routeKey of group.routeKeys) {
      const faq = getFaqForRoute(routeKey, language);
      if (!faq) continue;

      blocks.push(
        [
          `### ${pageSeo[routeKey][language].title.split("|")[0].trim()}`,
          "",
          `URL: ${absoluteUrl(canonicalRoutes[routeKey][language])}`,
          "",
          ...faq.map((item) => `**${item.question}**\n${item.answer}`),
        ].join("\n"),
      );
    }
  }

  return blocks.join("\n\n");
};

/**
 * A single flattened document is easier for a model to ingest in one fetch than
 * crawling 70 pages, and keeps answers grounded in our own wording.
 */
export const buildLlmsFullTxt = () => {
  const build = (language: SiteLanguage) =>
    [
      language === "sl" ? "# Calendra – celoten pregled" : "# Calendra – full overview",
      "",
      summary[language],
      "",
      language === "sl" ? "## Ključna dejstva" : "## Key facts",
      "",
      ...keyFacts(language).map((fact) => `- ${fact}`),
      "",
      language === "sl" ? "## Rešitve po dejavnostih" : "## Solutions by industry",
      "",
      industrySection(language),
      "",
      language === "sl" ? "## IT storitve" : "## IT services",
      "",
      itServiceSection(language),
      "",
      language === "sl" ? "## Pogosta vprašanja" : "## Frequently asked questions",
      "",
      faqSection(language),
    ].join("\n");

  return `${build("sl")}\n\n---\n\n${build("en")}\n`;
};
