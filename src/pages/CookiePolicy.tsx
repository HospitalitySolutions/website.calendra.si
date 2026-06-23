import { LegalDocument, LegalList, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Piškotki",
    title: "Politika piškotkov",
    intro: "Ta stran pojasnjuje uporabo piškotkov in podobnih tehnologij na spletni strani Calendra.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    sections: [
      {
        title: "1. Trenutno stanje",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "Spletna stran lahko uporablja analitične piškotke ali podobne tehnologije v skladu s prikazanimi nastavitvami soglasja."
            : "Spletna stran Calendra trenutno ne uporablja analitičnih ali oglaševalskih piškotkov.",
          "Uporabljamo lahko tehnično nujne piškotke ali podobno lokalno shranjevanje, kadar je to potrebno za delovanje spletne strani, izbiro jezika, varnost ali osnovno uporabniško izkušnjo.",
        ],
      },
      {
        title: "2. Vrste piškotkov",
        bullets: [
          "Nujni piškotki: potrebni za varno in pravilno delovanje spletne strani ali aplikacije.",
          "Nastavitveni piškotki: shranijo izbiro jezika ali podobne uporabniške nastavitve.",
          "Analitični piškotki: niso vključeni ob začetku produkcije; če jih dodamo, jih bomo opisali in po potrebi omogočili šele po soglasju.",
          "Oglaševalski piškotki: trenutno se ne uporabljajo.",
        ],
      },
      {
        title: "3. Upravljanje piškotkov",
        paragraphs: [
          "Piškotke lahko upravljate v nastavitvah svojega brskalnika. Blokiranje nujnih piškotkov lahko vpliva na delovanje spletne strani ali aplikacije.",
          `Za vprašanja glede piškotkov nam pišite na ${LEGAL.privacyEmail}.`,
        ],
      },
      {
        title: "4. Spremembe",
        paragraphs: ["Če bomo v prihodnosti dodali analitiko, oglaševalske tehnologije ali druge nenujne piškotke, bomo to politiko posodobili in uvedli ustrezen mehanizem soglasja, kadar bo to potrebno."],
      },
    ],
  },
  en: {
    badge: "Cookies",
    title: "Cookie Policy",
    intro: "This page explains how Calendra uses cookies and similar technologies on the website.",
    lastUpdated: "Last updated: 23 June 2026",
    sections: [
      {
        title: "1. Current status",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "The website may use analytics cookies or similar technologies according to the consent settings shown to users."
            : "The Calendra website does not currently use analytics or advertising cookies.",
          "We may use strictly necessary cookies or similar local storage where required for website operation, language selection, security or the basic user experience.",
        ],
      },
      {
        title: "2. Types of cookies",
        bullets: [
          "Strictly necessary cookies: required for secure and correct operation of the website or application.",
          "Preference cookies: store language choice or similar user settings.",
          "Analytics cookies: not included at production launch; if added later, they will be described and, where required, enabled only after consent.",
          "Advertising cookies: currently not used.",
        ],
      },
      {
        title: "3. Managing cookies",
        paragraphs: [
          "You can manage cookies in your browser settings. Blocking strictly necessary cookies may affect website or application functionality.",
          `For cookie questions, contact ${LEGAL.privacyEmail}.`,
        ],
      },
      {
        title: "4. Changes",
        paragraphs: ["If we add analytics, advertising technologies or other non-essential cookies in the future, we will update this policy and introduce an appropriate consent mechanism where required."],
      },
    ],
  },
};

const CookiePolicy = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      {c.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? <LegalList items={section.bullets} /> : null}
        </LegalSection>
      ))}
    </LegalDocument>
  );
};

export default CookiePolicy;
