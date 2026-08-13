import { WORDMARK } from "@/lib/brand-assets";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";
import { getIndustryContent, INDUSTRY_ROUTE_KEYS } from "@/lib/industry-pages";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import {
  FACEBOOK_PROFILE_URL,
  INSTAGRAM_PROFILE_URL,
  LINKEDIN_PROFILE_URL,
} from "@/lib/external-profiles";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { OPEN_COOKIE_SETTINGS_EVENT } from "@/lib/google-analytics";

type FooterLink = {
  key: CanonicalRouteKey;
  label: string;
};

const footerLinks: Record<"sl" | "en", { product: FooterLink[]; features: FooterLink[]; support: FooterLink[]; legal: FooterLink[] }> = {
  sl: {
    product: [
      { key: "booking", label: "Spletno naročanje" },
      { key: "customers", label: "Za stranke" },
      { key: "customerStories", label: "Zgodbe strank" },
      { key: "connect", label: "Calendra Connect" },
      { key: "pricing", label: "Cenik" },
    ],
    features: [
      { key: "calendar", label: "Koledar terminov" },
      { key: "clientManagement", label: "Upravljanje strank" },
      { key: "reminders", label: "SMS in e-poštni opomniki" },
      { key: "invoicing", label: "Računi in plačila" },
      { key: "integrations", label: "Integracije" },
      { key: "materialManagement", label: "Materialno poslovanje" },
    ],
    support: [
      { key: "blog", label: "Nasveti in vodniki" },
      { key: "contact", label: "Kontakt" },
      { key: "support", label: "Podpora za Calendro" },
      { key: "zoom", label: "Zoom integracija" },
    ],
    legal: [
      { key: "legal", label: "Pravno in zaupanje" },
      { key: "privacy", label: "Politika zasebnosti" },
      { key: "terms", label: "Pogoji uporabe" },
      { key: "dpa", label: "Pogodba o obdelavi podatkov" },
      { key: "subprocessors", label: "Podobdelovalci" },
      { key: "cookies", label: "Piškotki" },
      { key: "security", label: "Varnost" },
      { key: "dataRights", label: "Pravice posameznikov" },
      { key: "accountDeletion", label: "Izbris računa" },
      { key: "aiTransparency", label: "AI transparentnost" },
    ],
  },
  en: {
    product: [
      { key: "booking", label: "Online booking" },
      { key: "customers", label: "For customers" },
      { key: "customerStories", label: "Customer stories" },
      { key: "connect", label: "Calendra Connect" },
      { key: "pricing", label: "Pricing" },
    ],
    features: [
      { key: "calendar", label: "Appointment calendar" },
      { key: "clientManagement", label: "Client management" },
      { key: "reminders", label: "SMS and email reminders" },
      { key: "invoicing", label: "Invoicing and payments" },
      { key: "integrations", label: "Integrations" },
      { key: "materialManagement", label: "Inventory management" },
    ],
    support: [
      { key: "blog", label: "Guides and advice" },
      { key: "contact", label: "Contact" },
      { key: "support", label: "Calendra support" },
      { key: "zoom", label: "Zoom integration" },
    ],
    legal: [
      { key: "legal", label: "Legal & Trust" },
      { key: "privacy", label: "Privacy Policy" },
      { key: "terms", label: "Terms of Service" },
      { key: "dpa", label: "Data Processing Agreement" },
      { key: "subprocessors", label: "Subprocessors" },
      { key: "cookies", label: "Cookie Policy" },
      { key: "security", label: "Security" },
      { key: "dataRights", label: "Data Rights" },
      { key: "accountDeletion", label: "Account Deletion" },
      { key: "aiTransparency", label: "AI Transparency" },
    ],
  },
};

const FooterColumn = ({ title, links, language }: { title: string; links: FooterLink[]; language: "sl" | "en" }) => (
  <nav aria-label={title}>
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
      {links.map((link) => (
        <a key={link.key} href={getRoutePath(link.key, language)} className="transition-colors hover:text-foreground">
          {link.label}
        </a>
      ))}
    </div>
  </nav>
);


const FooterLegalColumn = ({ links, language }: { links: FooterLink[]; language: "sl" | "en" }) => (
  <nav aria-label={language === "sl" ? "Pravno in zaupanje" : "Legal & Trust"}>
    <p className="text-sm font-semibold text-foreground">{language === "sl" ? "Pravno in zaupanje" : "Legal & Trust"}</p>
    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
      {links.map((link) => (
        <a key={link.key} href={getRoutePath(link.key, language)} className="transition-colors hover:text-foreground">
          {link.label}
        </a>
      ))}
      <button
        type="button"
        className="w-fit text-left transition-colors hover:text-foreground"
        onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      >
        {language === "sl" ? "Nastavitve piškotkov" : "Cookie settings"}
      </button>
    </div>
  </nav>
);

const Footer = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).footer;
  const homePath = getRoutePath("home", language);
  const links = footerLinks[language];
  const socialLinks = [
    { label: "Facebook", href: FACEBOOK_PROFILE_URL, Icon: Facebook },
    { label: "Instagram", href: INSTAGRAM_PROFILE_URL, Icon: Instagram },
    { label: "LinkedIn", href: LINKEDIN_PROFILE_URL, Icon: Linkedin },
  ];

  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.1fr_0.7fr_1fr_1.1fr_1fr_0.8fr_1.2fr]">
          <div>
            <a href={homePath} className="inline-flex items-center">
              <img
                src={WORDMARK.src}
                alt="Calendra"
                width={WORDMARK.width}
                height={WORDMARK.height}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">© {new Date().getFullYear()} Calendra. {copy.rights}</p>
            <p className="mt-5 text-sm font-semibold text-foreground">{language === "sl" ? "Spremljajte Calendro" : "Follow Calendra"}</p>
            <div className="mt-3 flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${label} – Calendra`}
                  title={`${label} – Calendra`}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <FooterColumn title={language === "sl" ? "Produkt" : "Product"} links={links.product} language={language} />
          <FooterColumn title={language === "sl" ? "Funkcionalnosti" : "Features"} links={links.features} language={language} />
          <nav aria-label={language === "sl" ? "Rešitve po dejavnostih" : "Solutions by industry"}>
            <p className="text-sm font-semibold text-foreground">{language === "sl" ? "Po dejavnostih" : "By industry"}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              {INDUSTRY_ROUTE_KEYS.map((routeKey) => (
                <a key={routeKey} href={getRoutePath(routeKey, language)} className="transition-colors hover:text-foreground">
                  {getIndustryContent(routeKey, language).navLabel}
                </a>
              ))}
            </div>
          </nav>
          <nav aria-label={language === "sl" ? "IT storitve" : "IT services"}>
            <p className="text-sm font-semibold text-foreground">{language === "sl" ? "IT storitve" : "IT services"}</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <a href={getRoutePath("itServices", language)} className="font-medium text-foreground transition hover:text-primary">{language === "sl" ? "Pregled IT storitev" : "IT services overview"}</a>
              {IT_SERVICE_ROUTE_KEYS.map((routeKey) => (
                <a key={routeKey} href={getRoutePath(routeKey, language)} className="transition-colors hover:text-foreground">
                  {getItServiceContent(routeKey, language).navLabel}
                </a>
              ))}
            </div>
          </nav>
          <FooterColumn title={language === "sl" ? "Kontakt in podpora" : "Contact & support"} links={links.support} language={language} />
          <FooterLegalColumn links={links.legal} language={language} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
