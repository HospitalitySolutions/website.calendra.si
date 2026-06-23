import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

type LinkCard = {
  key: CanonicalRouteKey;
  title: string;
  description: string;
};

const copy = {
  sl: {
    badge: "Pravno in zaupanje",
    title: "Pravni dokumenti in informacije o zasebnosti",
    intro: "Na tej strani so zbrane javne pravne informacije, informacije o zasebnosti, obdelavi podatkov, podobdelovalcih, varnosti in pravicah uporabnikov za Calendra.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    sectionTitle: "Dokumenti",
    cards: [
      { key: "privacy", title: "Politika zasebnosti", description: "Kako Calendra obdeluje osebne podatke kot upravljavec in kot obdelovalec za najemnike." },
      { key: "terms", title: "Pogoji uporabe", description: "Pogoji za uporabo spletne strani, platforme, naročnin, mobilne aplikacije in integracij." },
      { key: "dpa", title: "Pogodba o obdelavi podatkov", description: "Pogoji obdelave osebnih podatkov, kadar Calendra obdeluje podatke v imenu najemnika." },
      { key: "subprocessors", title: "Podobdelovalci", description: "Seznam ponudnikov, ki lahko pomagajo pri zagotavljanju storitve Calendra." },
      { key: "cookies", title: "Piškotki", description: "Informacije o piškotkih in podobnih tehnologijah na spletni strani." },
      { key: "security", title: "Varnost", description: "Javni povzetek tehničnih in organizacijskih ukrepov za zaščito podatkov." },
      { key: "dataRights", title: "Pravice posameznikov", description: "Kako uveljavljati pravice glede osebnih podatkov in kdaj je pravi naslov najemnik." },
      { key: "accountDeletion", title: "Izbris računa", description: "Kako gost izbriše račun v Calendra Guest aplikaciji ali zahteva izbris prek spletne strani." },
      { key: "aiTransparency", title: "AI transparentnost", description: "Informacije o AI funkcionalnostih in ponudniku, če bodo AI funkcije omogočene." },
    ] satisfies LinkCard[],
  },
  en: {
    badge: "Legal & Trust",
    title: "Legal documents and privacy information",
    intro: "This page collects public legal, privacy, processing, subprocessor, security and user-rights information for Calendra.",
    lastUpdated: "Last updated: 23 June 2026",
    sectionTitle: "Documents",
    cards: [
      { key: "privacy", title: "Privacy Policy", description: "How Calendra processes personal data as a controller and as a processor for tenants." },
      { key: "terms", title: "Terms of Service", description: "Terms for using the website, platform, subscriptions, mobile app and integrations." },
      { key: "dpa", title: "Data Processing Agreement", description: "Processing terms that apply when Calendra processes personal data on behalf of a tenant." },
      { key: "subprocessors", title: "Subprocessors", description: "Providers that may help Calendra deliver the service." },
      { key: "cookies", title: "Cookie Policy", description: "Information about cookies and similar technologies on the website." },
      { key: "security", title: "Security", description: "Public summary of technical and organisational measures used to protect data." },
      { key: "dataRights", title: "Data Rights", description: "How to exercise privacy rights and when the tenant is the correct contact." },
      { key: "accountDeletion", title: "Account Deletion", description: "How a guest can delete an account in the Calendra Guest app or request deletion online." },
      { key: "aiTransparency", title: "AI Transparency", description: "Information about AI features and the provider if AI features are enabled." },
    ] satisfies LinkCard[],
  },
};

const LegalCenter = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={c.sectionTitle}>
        <div className="grid gap-4 md:grid-cols-2">
          {c.cards.map((card) => (
            <a key={card.key} href={getRoutePath(card.key, language)} className="rounded-2xl border border-border/60 bg-background/70 p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.04]">
              <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
            </a>
          ))}
        </div>
      </LegalSection>
    </LegalDocument>
  );
};

export default LegalCenter;
