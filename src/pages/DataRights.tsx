import { LegalDocument, LegalList, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Pravice posameznikov",
    title: "Uveljavljanje pravic glede osebnih podatkov",
    intro: "Ta stran pojasnjuje, kako lahko posamezniki uveljavljajo pravice glede osebnih podatkov v povezavi s Calendro.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    sections: [
      {
        title: "1. Katere pravice lahko uveljavljate",
        bullets: [
          "dostop do osebnih podatkov,",
          "popravek netočnih ali nepopolnih podatkov,",
          "izbris podatkov, kadar so izpolnjeni pogoji,",
          "omejitev obdelave,",
          "ugovor obdelavi,",
          "prenosljivost podatkov, kadar je to uporabljivo,",
          "preklic soglasja za prihodnjo obdelavo, če obdelava temelji na soglasju.",
        ],
      },
      {
        title: "2. Kdo je pravi kontakt",
        paragraphs: [
          "Za podatke računa Calendra, naročnine, podpore, spletne strani ali aplikacije Calendra Guest se lahko obrnete neposredno na Calendro.",
          "Za podatke, ki jih v Calendri vodi posamezen najemnik o svojih strankah, gostih, terminih, računih ali komunikaciji, je pravi prvi kontakt običajno najemnik, ker je ta praviloma upravljavec teh podatkov.",
          "Kadar Calendra nastopa kot obdelovalec, bomo najemniku pomagali pri obravnavi vaše zahteve v skladu s pogodbo o obdelavi podatkov in veljavno zakonodajo.",
        ],
      },
      {
        title: "3. Kako oddati zahtevo",
        paragraphs: [
          `Zahtevo pošljite na ${LEGAL.privacyEmail}. Navedite, na katere podatke se zahteva nanaša in ali gre za račun Calendra, Calendra Guest aplikacijo ali podatke pri določenem najemniku.`,
          "Zaradi varnosti lahko zahtevamo dodatno preverjanje identitete, preden izvedemo zahtevo.",
        ],
      },
      {
        title: "4. Rok in pritožba",
        paragraphs: [
          "Na zahteve odgovorimo v skladu z veljavno zakonodajo. Če je zahteva kompleksna ali obsežna, lahko potrebujemo dodatne informacije ali podaljšanje roka, kjer je to dovoljeno.",
          "Če menite, da so bile vaše pravice kršene, lahko vložite pritožbo pri Informacijskem pooblaščencu Republike Slovenije ali drugem pristojnem nadzornem organu.",
        ],
      },
    ],
  },
  en: {
    badge: "Data rights",
    title: "Exercising personal data rights",
    intro: "This page explains how individuals can exercise personal data rights in connection with Calendra.",
    lastUpdated: "Last updated: 23 June 2026",
    sections: [
      {
        title: "1. Rights you may exercise",
        bullets: [
          "access to personal data,",
          "rectification of inaccurate or incomplete data,",
          "erasure where the conditions are met,",
          "restriction of processing,",
          "objection to processing,",
          "data portability where applicable,",
          "withdrawal of consent for future processing where processing is based on consent.",
        ],
      },
      {
        title: "2. Who to contact",
        paragraphs: [
          "For Calendra account, subscription, support, website or Calendra Guest app data, you may contact Calendra directly.",
          "For data held in Calendra by a specific tenant about its customers, guests, appointments, invoices or communications, the correct first contact is usually the tenant, because the tenant is generally the controller for that data.",
          "Where Calendra acts as processor, we will assist the tenant with your request according to the Data Processing Agreement and applicable law.",
        ],
      },
      {
        title: "3. How to submit a request",
        paragraphs: [
          `Send your request to ${LEGAL.privacyEmail}. Explain which data the request concerns and whether it relates to a Calendra account, the Calendra Guest app, or data held by a specific tenant.`,
          "For security, we may require additional identity verification before completing the request.",
        ],
      },
      {
        title: "4. Timing and complaint",
        paragraphs: [
          "We respond to requests according to applicable law. If a request is complex or extensive, we may need further information or an extension where permitted.",
          "If you believe your rights have been infringed, you may lodge a complaint with the Information Commissioner of the Republic of Slovenia or another competent supervisory authority.",
        ],
      },
    ],
  },
};

const DataRights = () => {
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

export default DataRights;
