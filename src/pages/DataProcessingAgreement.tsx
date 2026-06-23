import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "DPA",
    title: "Pogodba o obdelavi osebnih podatkov",
    intro: "Ti pogoji obdelave podatkov urejajo obdelavo osebnih podatkov, kadar Calendra obdeluje podatke v imenu poslovnega uporabnika oziroma najemnika platforme.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    notice: "Ta javna različica je pripravljena kot osnutek za produkcijsko uporabo in naj jo pred širšim zagonom pregleda pravnik za slovensko/EU pravo.",
    sections: [
      {
        title: "1. Stranke in vloge",
        paragraphs: [
          `Ponudnik storitve Calendra je ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}.`,
          "Najemnik, ki uporablja Calendro za svoje stranke, goste, zaposlene ali poslovne procese, praviloma nastopa kot upravljavec osebnih podatkov. Calendra pri takšni obdelavi praviloma nastopa kot obdelovalec.",
          "Za podatke, pri katerih Calendra samostojno določa namen in sredstva obdelave, na primer obračun naročnine, podpora, varnost spletne strani in komunikacija s potencialnimi strankami, Calendra nastopa kot upravljavec, kar je urejeno v Politiki zasebnosti.",
        ],
      },
      {
        title: "2. Predmet, namen in trajanje obdelave",
        paragraphs: [
          "Predmet obdelave je zagotavljanje platforme Calendra, vključno z naročanjem, koledarjem, obvestili, obračunom, računi, denarnico/ugodnostmi, tečaji, sporočili, integracijami in podporo.",
          "Obdelava traja toliko časa, kolikor najemnik uporablja storitev, in po prenehanju toliko časa, kolikor je potrebno za zakonito zaprtje računa, izvoz, izbris, anonimizacijo, varnostne kopije, zahtevke ali zakonske obveznosti.",
        ],
      },
      {
        title: "3. Kategorije posameznikov in podatkov",
        bullets: [
          "najemniki in njihovi uporabniki,",
          "gosti in stranke najemnikov,",
          "udeleženci terminov, tečajev, dogodkov ali programov,",
          "plačniki, prejemniki računov in kontaktne osebe,",
          "podatki o terminih, naročilih, računih, plačilih, ugodnostih, sporočilih, dostavnih dnevnikih, datotekah in integracijah.",
        ],
      },
      {
        title: "4. Obveznosti Calendra kot obdelovalca",
        bullets: [
          "osebne podatke obdeluje samo po dokumentiranih navodilih najemnika, razen kadar zakon določa drugače,",
          "zagotovi, da so osebe z dostopom zavezane k zaupnosti,",
          "izvaja primerne tehnične in organizacijske ukrepe,",
          "pomaga najemniku pri obravnavi zahtev posameznikov, kadar je to razumno mogoče,",
          "pomaga pri varnostnih incidentih in obveznostih glede varstva podatkov, kjer je to uporabljivo,",
          "po prenehanju storitve podatke izbriše, anonimizira ali vrne v skladu z nastavitvami, tehničnimi možnostmi in zakonskimi obveznostmi.",
        ],
      },
      {
        title: "5. Podobdelovalci",
        paragraphs: [
          "Najemnik daje splošno dovoljenje za uporabo podobdelovalcev, potrebnih za zagotavljanje platforme, infrastrukture, plačil, komunikacij, mobilnih funkcij in omogočenih integracij.",
          "Aktualen seznam podobdelovalcev je javno objavljen in se lahko posodobi.",
        ],
      },
      {
        title: "6. Varnost, incidenti in prenosi",
        paragraphs: [
          "Calendra uporablja primerne tehnične in organizacijske ukrepe glede na naravo storitve, tveganja in razpoložljive tehnologije. Javni povzetek je objavljen na strani Varnost.",
          "Če Calendra zazna kršitev varnosti osebnih podatkov, ki se nanaša na podatke, obdelane v imenu najemnika, bo najemnika obvestila brez nepotrebnega odlašanja, ko je incident potrjen in so znane osnovne informacije.",
          "Prenosi izven EGP se izvajajo le, kadar obstajajo ustrezni zaščitni ukrepi ali druga veljavna pravna podlaga.",
        ],
      },
      {
        title: "7. Revizije, informacije in spremembe",
        paragraphs: [
          "Calendra bo najemniku dala razumno potrebne informacije za dokazovanje skladnosti s temi pogoji, pri čemer se upoštevajo varnost, zaupnost in zaščita drugih najemnikov.",
          "Ti pogoji se lahko posodobijo. Če sprememba bistveno vpliva na obdelavo osebnih podatkov, bo Calendra najemnike obvestila na primeren način.",
        ],
      },
    ],
    linksTitle: "Povezani dokumenti",
    links: [
      { label: "Politika zasebnosti", route: "privacy" },
      { label: "Podobdelovalci", route: "subprocessors" },
      { label: "Varnost", route: "security" },
      { label: "Pravice posameznikov", route: "dataRights" },
    ] as const,
  },
  en: {
    badge: "DPA",
    title: "Data Processing Agreement",
    intro: "These data processing terms govern the processing of personal data where Calendra processes data on behalf of a business customer or platform tenant.",
    lastUpdated: "Last updated: 23 June 2026",
    notice: "This public version is prepared as a production draft and should be reviewed by a lawyer for Slovenian/EU law before a wider launch.",
    sections: [
      {
        title: "1. Parties and roles",
        paragraphs: [
          `The Calendra service provider is ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}.`,
          "A tenant using Calendra for its own customers, guests, employees or business processes generally acts as controller. Calendra generally acts as processor for such processing.",
          "For data where Calendra independently determines the purpose and means of processing, such as subscription billing, support, website security and communication with prospects, Calendra acts as controller as described in the Privacy Policy.",
        ],
      },
      {
        title: "2. Subject matter, purpose and duration",
        paragraphs: [
          "The subject matter of processing is the provision of the Calendra platform, including booking, calendar, notifications, billing, invoices, wallet/entitlements, courses, messages, integrations and support.",
          "Processing lasts while the tenant uses the service and after termination for as long as needed for lawful account closure, export, deletion, anonymisation, backups, claims or legal obligations.",
        ],
      },
      {
        title: "3. Categories of data subjects and data",
        bullets: [
          "tenants and their users,",
          "guests and tenant customers,",
          "participants in appointments, courses, events or programmes,",
          "payers, invoice recipients and contact persons,",
          "appointment, order, invoice, payment, entitlement, message, delivery log, file and integration data.",
        ],
      },
      {
        title: "4. Calendra obligations as processor",
        bullets: [
          "process personal data only on documented tenant instructions, unless the law requires otherwise,",
          "ensure that persons with access are bound by confidentiality,",
          "apply appropriate technical and organisational measures,",
          "assist the tenant with data subject requests where reasonably possible,",
          "assist with security incidents and data protection obligations where applicable,",
          "after service termination, delete, anonymise or return data according to settings, technical possibilities and legal obligations.",
        ],
      },
      {
        title: "5. Subprocessors",
        paragraphs: [
          "The tenant gives general authorisation to use subprocessors required to provide the platform, infrastructure, payments, communications, mobile features and enabled integrations.",
          "The current subprocessor list is published publicly and may be updated.",
        ],
      },
      {
        title: "6. Security, incidents and transfers",
        paragraphs: [
          "Calendra applies appropriate technical and organisational measures based on the nature of the service, risks and available technologies. A public summary is published on the Security page.",
          "If Calendra detects a personal data breach concerning data processed on behalf of the tenant, Calendra will notify the tenant without undue delay once the incident is confirmed and basic information is available.",
          "Transfers outside the EEA are performed only where appropriate safeguards or another valid legal basis are in place.",
        ],
      },
      {
        title: "7. Audits, information and changes",
        paragraphs: [
          "Calendra will provide the tenant with reasonably necessary information to demonstrate compliance with these terms, taking into account security, confidentiality and protection of other tenants.",
          "These terms may be updated. If a change materially affects personal data processing, Calendra will notify tenants in an appropriate way.",
        ],
      },
    ],
    linksTitle: "Related documents",
    links: [
      { label: "Privacy Policy", route: "privacy" },
      { label: "Subprocessors", route: "subprocessors" },
      { label: "Security", route: "security" },
      { label: "Data Rights", route: "dataRights" },
    ] as const,
  },
};

const DataProcessingAgreement = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={language === "sl" ? "Pomembna opomba" : "Important note"} tone="warning">
        <LegalNotice>{c.notice}</LegalNotice>
      </LegalSection>
      {c.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? <LegalList items={section.bullets} /> : null}
        </LegalSection>
      ))}
      <LegalSection title={c.linksTitle}>
        <div className="flex flex-wrap gap-3">
          {c.links.map((link) => (
            <a key={link.route} href={getRoutePath(link.route, language)} className="rounded-full border border-border/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/[0.05]">
              {link.label}
            </a>
          ))}
        </div>
      </LegalSection>
    </LegalDocument>
  );
};

export default DataProcessingAgreement;
