import calendraLogo from "@/assets/calendra-logo.png";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";

type FooterLink = {
  key: CanonicalRouteKey;
  label: string;
};

const footerLinks: Record<"sl" | "en", { product: FooterLink[]; features: FooterLink[]; support: FooterLink[]; legal: FooterLink[] }> = {
  sl: {
    product: [
      { key: "booking", label: "Naročanje" },
      { key: "pricing", label: "Cenik" },
    ],
    features: [
      { key: "calendar", label: "Koledar terminov" },
      { key: "clientManagement", label: "Upravljanje strank" },
      { key: "reminders", label: "SMS in e-poštni opomniki" },
      { key: "invoicing", label: "Računi in plačila" },
      { key: "integrations", label: "Integracije" },
    ],
    support: [
      { key: "support", label: "Podpora" },
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
      { key: "booking", label: "Booking" },
      { key: "pricing", label: "Pricing" },
    ],
    features: [
      { key: "calendar", label: "Appointment calendar" },
      { key: "clientManagement", label: "Client management" },
      { key: "reminders", label: "SMS and email reminders" },
      { key: "invoicing", label: "Invoicing and payments" },
      { key: "integrations", label: "Integrations" },
    ],
    support: [
      { key: "support", label: "Support" },
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
  <div>
    <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
      {links.map((link) => (
        <a key={link.key} href={getRoutePath(link.key, language)} className="transition-colors hover:text-foreground">
          {link.label}
        </a>
      ))}
    </div>
  </div>
);

const Footer = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).footer;
  const homePath = getRoutePath("home", language);
  const links = footerLinks[language];

  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_1fr_0.8fr_1.4fr]">
          <div>
            <a href={homePath} className="inline-flex items-center">
              <img src={calendraLogo} alt="Calendra" className="h-10 w-auto" />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">© {new Date().getFullYear()} Calendra. {copy.rights}</p>
          </div>
          <FooterColumn title={language === "sl" ? "Produkt" : "Product"} links={links.product} language={language} />
          <FooterColumn title={language === "sl" ? "Funkcionalnosti" : "Features"} links={links.features} language={language} />
          <FooterColumn title={language === "sl" ? "Podpora" : "Support"} links={links.support} language={language} />
          <FooterColumn title={language === "sl" ? "Pravno in zaupanje" : "Legal & Trust"} links={links.legal} language={language} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
