import { LegalDocument, LegalList, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Piškotki",
    title: "Politika piškotkov",
    intro: "Ta stran pojasnjuje uporabo piškotkov in podobnih tehnologij na spletni strani Calendra.",
    lastUpdated: "Zadnja posodobitev: 11. avgust 2026",
    sections: [
      {
        title: "1. Trenutno stanje",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "Za osnovno merjenje obiska uporabljamo Umami, analitiko brez piškotkov, ki jo gostimo sami na svoji infrastrukturi v EU. Google Analytics 4 uporabljamo dodatno samo, če obiskovalec dovoli analitiko."
            : "Spletna stran trenutno ne uporablja analitike.",
          "Google Analytics se pred soglasjem ne naloži. Če analitiko dovolite, lahko Google Analytics uporablja analitične piškotke oziroma podobne identifikatorje za merjenje uporabe spletne strani. Oglaševalske vrste soglasja ostanejo onemogočene.",
          "Uporabljamo lahko tudi tehnično nujne piškotke ali lokalno shranjevanje za delovanje spletne strani, izbiro jezika, varnost in shranjevanje vaše izbire glede analitike.",
        ],
      },
      {
        title: "2. Vrste piškotkov",
        bullets: [
          "Nujni piškotki: potrebni za varno in pravilno delovanje spletne strani ali aplikacije.",
          "Nastavitveni piškotki: shranijo izbiro jezika ali podobne uporabniške nastavitve.",
          "Analitični piškotki: Google Analytics jih lahko uporabi samo po vašem soglasju za analitiko. Umami deluje brez piškotkov.",
          "Oglaševalski piškotki: se na spletni strani trenutno ne uporabljajo; oglaševalske vrste soglasja za Google tag ostanejo onemogočene.",
        ],
      },
      {
        title: "3. Analitika",
        paragraphs: [
          "Umami gostimo sami na lastni infrastrukturi v EU, zato se podatki o obisku ne posredujejo zunanjim oglaševalskim omrežjem in ne dodajajo novega podobdelovalca.",
          "Umami ne nastavlja piškotkov, ne uporablja prstnih odtisov naprave in ne ustvarja identifikatorjev, ki bi vas prepoznali na drugih spletnih straneh. Ne zbiramo IP naslovov v obliki, ki bi omogočala identifikacijo posameznika.",
          "Za Umami zato ne zahtevamo soglasja za analitične piškotke. Google Analytics je ločen in se naloži samo po vaši izbiri »Dovoli analitiko«.",
          "Google Analytics uporabljamo za dodatno razumevanje ogledov strani, virov obiska in interakcij s spletno stranjo. V Google Analytics ne pošiljamo vsebine obrazcev, imen, e-poštnih naslovov ali telefonskih številk.",
        ],
        bullets: [
          "Kaj merimo: ogledi strani, vir obiska, država, vrsta naprave in brskalnika ter dogodki, kot je klik na preizkus ali rezervacijo predstavitve.",
          "Česa ne pošiljamo v analitiko: vsebina obrazcev, imena, e-poštni naslovi ali telefonske številke.",
        ],
      },
      {
        title: "4. Upravljanje piškotkov",
        paragraphs: [
          "Izbiro za Google Analytics lahko kadarkoli spremenite prek povezave »Nastavitve piškotkov« v nogi spletne strani. Piškotke lahko upravljate tudi v nastavitvah brskalnika. Blokiranje nujnih piškotkov lahko vpliva na delovanje spletne strani ali aplikacije.",
          `Za vprašanja glede piškotkov nam pišite na ${LEGAL.privacyEmail}.`,
        ],
      },
      {
        title: "5. Spremembe",
        paragraphs: ["Če bomo v prihodnosti dodali oglaševalske tehnologije ali druge nenujne piškotke, bomo to politiko posodobili in uvedli ustrezen mehanizem soglasja, kadar bo to potrebno."],
      },
    ],
  },
  en: {
    badge: "Cookies",
    title: "Cookie Policy",
    intro: "This page explains how Calendra uses cookies and similar technologies on the website.",
    lastUpdated: "Last updated: 11 August 2026",
    sections: [
      {
        title: "1. Current status",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "For baseline traffic measurement we use Umami, a cookieless analytics tool we self-host on our own EU infrastructure. We additionally use Google Analytics 4 only when the visitor allows analytics."
            : "The website does not currently use analytics.",
          "Google Analytics is not loaded before consent. If you allow analytics, Google Analytics may use analytics cookies or similar identifiers to measure website usage. Advertising consent types remain disabled.",
          "We may also use strictly necessary cookies or local storage for website operation, language selection, security and storing your analytics choice.",
        ],
      },
      {
        title: "2. Types of cookies",
        bullets: [
          "Strictly necessary cookies: required for secure and correct operation of the website or application.",
          "Preference cookies: store language choice or similar user settings.",
          "Analytics cookies: Google Analytics may use them only after you consent to analytics. Umami works without cookies.",
          "Advertising cookies: currently not used on the website; advertising consent types for the Google tag remain disabled.",
        ],
      },
      {
        title: "3. Analytics",
        paragraphs: [
          "We self-host Umami on our own EU infrastructure, so traffic data is never shared with external advertising networks and no additional subprocessor is involved.",
          "Umami sets no cookies, does not fingerprint your device and does not create identifiers that could recognise you on other websites. We do not retain IP addresses in a form that identifies an individual.",
          "We therefore do not request analytics-cookie consent for Umami. Google Analytics is separate and loads only after you choose “Allow analytics”.",
          "We use Google Analytics for additional understanding of page views, traffic sources and website interactions. We do not send form contents, names, email addresses or phone numbers to Google Analytics.",
        ],
        bullets: [
          "What we measure: page views, referrer, country, device and browser type, and events such as starting a trial or booking a demo.",
          "What we do not send to analytics: form contents, names, email addresses or phone numbers.",
        ],
      },
      {
        title: "4. Managing cookies",
        paragraphs: [
          "You can change your Google Analytics choice at any time through “Cookie settings” in the website footer. You can also manage cookies in your browser settings. Blocking strictly necessary cookies may affect website or application functionality.",
          `For cookie questions, contact ${LEGAL.privacyEmail}.`,
        ],
      },
      {
        title: "5. Changes",
        paragraphs: ["If we add advertising technologies or other non-essential cookies in the future, we will update this policy and introduce an appropriate consent mechanism where required."],
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
