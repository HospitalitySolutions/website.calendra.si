import { LegalDocument, LegalList, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Piškotki",
    title: "Politika piškotkov",
    intro: "Ta stran pojasnjuje uporabo piškotkov in podobnih tehnologij na spletni strani Calendra.",
    lastUpdated: "Zadnja posodobitev: 30. julij 2026",
    sections: [
      {
        title: "1. Trenutno stanje",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "Spletna stran Calendra ne uporablja analitičnih ali oglaševalskih piškotkov. Za merjenje obiska uporabljamo Umami, analitiko brez piškotkov, ki jo gostimo sami na svoji infrastrukturi v EU."
            : "Spletna stran Calendra trenutno ne uporablja analitičnih ali oglaševalskih piškotkov.",
          "Uporabljamo lahko tehnično nujne piškotke ali podobno lokalno shranjevanje, kadar je to potrebno za delovanje spletne strani, izbiro jezika, varnost ali osnovno uporabniško izkušnjo.",
        ],
      },
      {
        title: "2. Vrste piškotkov",
        bullets: [
          "Nujni piškotki: potrebni za varno in pravilno delovanje spletne strani ali aplikacije.",
          "Nastavitveni piškotki: shranijo izbiro jezika ali podobne uporabniške nastavitve.",
          "Analitični piškotki: se ne uporabljajo. Merjenje obiska poteka brez piškotkov in brez shranjevanja podatkov na vaši napravi.",
          "Oglaševalski piškotki: trenutno se ne uporabljajo.",
        ],
      },
      {
        title: "3. Analitika brez piškotkov",
        paragraphs: [
          "Umami gostimo sami na lastni infrastrukturi v EU, zato se podatki o obisku ne posredujejo zunanjim oglaševalskim omrežjem in ne dodajajo novega podobdelovalca.",
          "Umami ne nastavlja piškotkov, ne uporablja prstnih odtisov naprave in ne ustvarja identifikatorjev, ki bi vas prepoznali na drugih spletnih straneh. Ne zbiramo IP naslovov v obliki, ki bi omogočala identifikacijo posameznika.",
          "Ker se podatki ne shranjujejo na vaši napravi in ne omogočajo identifikacije posameznika, za to merjenje ni potrebno soglasje s piškotki.",
        ],
        bullets: [
          "Kaj merimo: ogledi strani, vir obiska, država, vrsta naprave in brskalnika ter dogodki, kot je klik na preizkus ali rezervacijo predstavitve.",
          "Česa ne merimo: imena, e-pošta, telefonska številka, vsebina obrazcev ali kakršni koli podatki o posameznikih.",
        ],
      },
      {
        title: "4. Upravljanje piškotkov",
        paragraphs: [
          "Piškotke lahko upravljate v nastavitvah svojega brskalnika. Blokiranje nujnih piškotkov lahko vpliva na delovanje spletne strani ali aplikacije.",
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
    lastUpdated: "Last updated: 30 July 2026",
    sections: [
      {
        title: "1. Current status",
        paragraphs: [
          LEGAL.websiteAnalyticsEnabled
            ? "The Calendra website does not use analytics or advertising cookies. We measure traffic with Umami, a cookieless analytics tool we self-host on our own EU infrastructure."
            : "The Calendra website does not currently use analytics or advertising cookies.",
          "We may use strictly necessary cookies or similar local storage where required for website operation, language selection, security or the basic user experience.",
        ],
      },
      {
        title: "2. Types of cookies",
        bullets: [
          "Strictly necessary cookies: required for secure and correct operation of the website or application.",
          "Preference cookies: store language choice or similar user settings.",
          "Analytics cookies: not used. Traffic measurement works without cookies and without storing anything on your device.",
          "Advertising cookies: currently not used.",
        ],
      },
      {
        title: "3. Cookieless analytics",
        paragraphs: [
          "We self-host Umami on our own EU infrastructure, so traffic data is never shared with external advertising networks and no additional subprocessor is involved.",
          "Umami sets no cookies, does not fingerprint your device and does not create identifiers that could recognise you on other websites. We do not retain IP addresses in a form that identifies an individual.",
          "Because nothing is stored on your device and the data cannot identify an individual, this measurement does not require cookie consent.",
        ],
        bullets: [
          "What we measure: page views, referrer, country, device and browser type, and events such as starting a trial or booking a demo.",
          "What we do not measure: names, email addresses, phone numbers, form contents or any personal data about individuals.",
        ],
      },
      {
        title: "4. Managing cookies",
        paragraphs: [
          "You can manage cookies in your browser settings. Blocking strictly necessary cookies may affect website or application functionality.",
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
