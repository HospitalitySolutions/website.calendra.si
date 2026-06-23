import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Pogoji uporabe",
    title: "Pogoji uporabe Calendra",
    intro: "Ti pogoji urejajo uporabo spletne strani, platforme Calendra, tenant aplikacije, Calendra Guest aplikacije, naročnin, integracij in povezanih storitev.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    notice: "Ti pogoji so pripravljeni kot produkcijski osnutek za SaaS uporabo. Pred širšim zagonom naj jih pregleda pravnik za slovensko/EU pravo, zlasti glede odgovornosti, potrošniških vprašanj in davčno-računovodskih posebnosti.",
    sections: [
      {
        title: "1. Ponudnik storitve",
        paragraphs: [`Storitev Calendra zagotavlja ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}. Kontakt za podporo in pravna vprašanja: ${LEGAL.supportEmail}.`],
      },
      {
        title: "2. Opis storitve",
        paragraphs: [
          "Calendra je B2B SaaS platforma za storitvena podjetja in organizacije. Vključuje lahko spletno naročanje, koledar terminov, stranke, račune, plačila, opomnike, denarnico/ugodnosti, tečaje, sporočila, mobilno aplikacijo za goste, integracije in druge funkcionalnosti.",
          "Dostopne funkcionalnosti so odvisne od izbranega paketa, nastavitev najemnika, omogočenih integracij in produkcijske razpoložljivosti posameznih modulov.",
        ],
      },
      {
        title: "3. Registracija, naročnina in sprejem pogojev",
        paragraphs: [
          LEGAL.tenantSignupRequiresTermsAndDpa
            ? "Najemnik ob registraciji oziroma aktivaciji sprejme te pogoje in Pogodbo o obdelavi podatkov."
            : "Najemnik mora pred produkcijsko uporabo sprejeti te pogoje in Pogodbo o obdelavi podatkov.",
          "Najemnik je odgovoren za pravilnost podatkov, varovanje dostopov svojih uporabnikov in za zakonito uporabo platforme pri svojem poslovanju.",
        ],
      },
      {
        title: "4. Plačila, paketi in davki",
        paragraphs: [
          "Cene, paketi, obračunski intervali, vključene funkcionalnosti in dodatki so določeni v ceniku, ponudbi, naročilnici ali drugem dogovoru z najemnikom.",
          "Najemnik je odgovoren za pravočasno plačilo naročnine in morebitnih dodatkov. V primeru neplačila lahko Calendra omeji, začasno ustavi ali prekine dostop v skladu z dogovorom in veljavno zakonodajo.",
          "Davki, pristojbine in računovodske obveznosti se obravnavajo v skladu z veljavno zakonodajo in podatki, ki jih zagotovi najemnik.",
        ],
      },
      {
        title: "5. Odgovornosti najemnika",
        bullets: [
          "zagotoviti zakonito podlago za obdelavo podatkov svojih strank, gostov in uporabnikov,",
          "zagotoviti pravilne informacije, soglasja in obvestila svojim strankam, kadar so potrebna,",
          "skrbeti za pravilnost terminov, cen, računov, plačil, davčnih nastavitev in komunikacij,",
          "uporabljati integracije v skladu s pogoji zunanjih ponudnikov,",
          "preprečiti zlorabe, nepooblaščen dostop in neprimerno uporabo platforme.",
        ],
      },
      {
        title: "6. Prepovedana uporaba",
        bullets: [
          "nepooblaščen dostop, testiranje ranljivosti brez dovoljenja ali motenje delovanja,",
          "pošiljanje neželene pošte, zavajajočih sporočil ali nezakonitih vsebin,",
          "uporaba platforme za nezakonite, škodljive, goljufive ali visoko regulirane namene brez ustrezne pravne podlage,",
          "obdelava podatkov na način, ki krši GDPR, ZVOP-2 ali druge veljavne predpise,",
          "kopiranje, prodaja, oddaja ali obratni inženiring platforme v nasprotju s temi pogoji.",
        ],
      },
      {
        title: "7. Integracije in zunanji ponudniki",
        paragraphs: [
          "Calendra lahko omogoča integracije s ponudniki, kot so Google, Zoom, Stripe, Apple, Firebase, OpenAI, A1, Bunny.net in drugi. Uporaba integracij je lahko odvisna od pogojev, računov, nastavitev in razpoložljivosti teh ponudnikov.",
          "Calendra ne odgovarja za izpade, spremembe, omejitve ali napake zunanjih ponudnikov, razen v obsegu, ki ga zahteva prisilna zakonodaja.",
        ],
      },
      {
        title: "8. AI funkcije",
        paragraphs: [
          LEGAL.aiEnabledAtProductionLaunch
            ? "Izbrane AI funkcije so lahko na voljo. AI izhodi lahko vsebujejo napake in jih mora uporabnik pred uporabo preveriti."
            : "AI funkcije niso omogočene ob začetku produkcije. Če bodo kasneje omogočene, bodo opisane v nastavitvah in na strani AI transparentnost.",
          "Calendra ne nadomešča strokovne, pravne, davčne, medicinske, psihološke ali druge regulirane presoje uporabnika oziroma najemnika.",
        ],
      },
      {
        title: "9. Varstvo podatkov",
        paragraphs: [
          "Obdelava osebnih podatkov je opisana v Politiki zasebnosti. Kadar Calendra obdeluje osebne podatke v imenu najemnika, se uporablja tudi Pogodba o obdelavi podatkov.",
          "Najemnik ostaja odgovoren za zakonitost svojih navodil, vsebine, podatkov in komunikacij, ki jih vodi v platformi.",
        ],
      },
      {
        title: "10. Razpoložljivost, podpora in spremembe",
        paragraphs: [
          "Prizadevamo si za stabilno in varno delovanje platforme, vendar ne jamčimo, da bo storitev vedno neprekinjena, brez napak ali primerna za vsak posamezen namen.",
          "Funkcionalnosti lahko spreminjamo, nadgrajujemo, začasno omejimo ali odstranimo zaradi varnosti, skladnosti, tehničnega razvoja ali poslovnih razlogov.",
        ],
      },
      {
        title: "11. Omejitev odgovornosti",
        paragraphs: [
          "V največjem obsegu, ki ga dovoljuje zakon, Calendra ne odgovarja za posredno škodo, izgubljeni dobiček, izgubo poslovnih priložnosti, izgubo podatkov zaradi ravnanja najemnika ali izpade zunanjih ponudnikov.",
          "Nobena določba teh pogojev ne omejuje odgovornosti, ki je po prisilni zakonodaji ni mogoče omejiti.",
        ],
      },
      {
        title: "12. Prenehanje in pravo",
        paragraphs: [
          `Za te pogoje se uporablja pravo države ${LEGAL.governingLaw}, razen če prisilna zakonodaja določa drugače.`,
          "Po prenehanju naročniškega razmerja lahko najemnik izgubi dostop do platforme. Podatki se izbrišejo, anonimizirajo ali hranijo v skladu z veljavno zakonodajo, pogodbo, DPA in tehničnimi pravili hrambe.",
        ],
      },
    ],
    linksTitle: "Povezani dokumenti",
    links: [
      { label: "Politika zasebnosti", route: "privacy" },
      { label: "Pogodba o obdelavi podatkov", route: "dpa" },
      { label: "Podobdelovalci", route: "subprocessors" },
      { label: "Varnost", route: "security" },
    ] as const,
  },
  en: {
    badge: "Terms of Service",
    title: "Calendra Terms of Service",
    intro: "These terms govern use of the Calendra website, platform, tenant app, Calendra Guest app, subscriptions, integrations and related services.",
    lastUpdated: "Last updated: 23 June 2026",
    notice: "These terms are prepared as a production SaaS draft. Before a wider launch, they should be reviewed by a Slovenian/EU lawyer, especially for liability, consumer issues and tax/accounting specifics.",
    sections: [
      {
        title: "1. Service provider",
        paragraphs: [`Calendra is provided by ${LEGAL.entityName}, ${LEGAL_FULL_ADDRESS}. Support and legal contact: ${LEGAL.supportEmail}.`],
      },
      {
        title: "2. Service description",
        paragraphs: [
          "Calendra is a B2B SaaS platform for service businesses and organisations. It may include online booking, appointment calendar, clients, invoices, payments, reminders, wallet/entitlements, courses, messages, guest mobile app, integrations and other functionality.",
          "Available features depend on the selected package, tenant settings, enabled integrations and production availability of individual modules.",
        ],
      },
      {
        title: "3. Registration, subscription and acceptance",
        paragraphs: [
          LEGAL.tenantSignupRequiresTermsAndDpa
            ? "The tenant accepts these terms and the Data Processing Agreement during registration or activation."
            : "The tenant must accept these terms and the Data Processing Agreement before production use.",
          "The tenant is responsible for accurate information, protecting access for its users and lawful use of the platform in its business.",
        ],
      },
      {
        title: "4. Payments, packages and taxes",
        paragraphs: [
          "Prices, packages, billing intervals, included features and add-ons are defined in the pricing page, offer, order form or other agreement with the tenant.",
          "The tenant is responsible for timely payment of subscription fees and add-ons. In case of non-payment, Calendra may limit, suspend or terminate access according to the agreement and applicable law.",
          "Taxes, fees and accounting obligations are handled according to applicable law and information provided by the tenant.",
        ],
      },
      {
        title: "5. Tenant responsibilities",
        bullets: [
          "provide a lawful basis for processing data of its customers, guests and users,",
          "provide correct information, consents and notices to its customers where required,",
          "ensure correctness of appointments, prices, invoices, payments, tax settings and communications,",
          "use integrations according to third-party provider terms,",
          "prevent abuse, unauthorised access and inappropriate platform use.",
        ],
      },
      {
        title: "6. Prohibited use",
        bullets: [
          "unauthorised access, vulnerability testing without permission or service disruption,",
          "sending spam, misleading messages or illegal content,",
          "using the platform for unlawful, harmful, fraudulent or highly regulated purposes without a proper legal basis,",
          "processing data in a way that breaches GDPR, ZVOP-2 or other applicable rules,",
          "copying, selling, leasing or reverse engineering the platform contrary to these terms.",
        ],
      },
      {
        title: "7. Integrations and third-party providers",
        paragraphs: [
          "Calendra may support integrations with providers such as Google, Zoom, Stripe, Apple, Firebase, OpenAI, A1, Bunny.net and others. Use of integrations may depend on these providers' terms, accounts, settings and availability.",
          "Calendra is not responsible for outages, changes, limitations or errors of third-party providers except where mandatory law requires otherwise.",
        ],
      },
      {
        title: "8. AI features",
        paragraphs: [
          LEGAL.aiEnabledAtProductionLaunch
            ? "Selected AI features may be available. AI outputs may contain errors and must be reviewed by the user before use."
            : "AI features are not enabled at production launch. If enabled later, they will be described in settings and on the AI Transparency page.",
          "Calendra does not replace professional, legal, tax, medical, psychological or other regulated judgment of the user or tenant.",
        ],
      },
      {
        title: "9. Data protection",
        paragraphs: [
          "Personal data processing is described in the Privacy Policy. Where Calendra processes personal data on behalf of the tenant, the Data Processing Agreement also applies.",
          "The tenant remains responsible for the lawfulness of its instructions, content, data and communications held in the platform.",
        ],
      },
      {
        title: "10. Availability, support and changes",
        paragraphs: [
          "We aim to provide a stable and secure platform, but do not guarantee that the service will always be uninterrupted, error-free or suitable for every specific purpose.",
          "Features may be changed, upgraded, temporarily limited or removed for security, compliance, technical development or business reasons.",
        ],
      },
      {
        title: "11. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, Calendra is not liable for indirect damage, lost profits, lost business opportunities, data loss caused by tenant actions or third-party provider outages.",
          "Nothing in these terms limits liability that cannot be limited under mandatory law.",
        ],
      },
      {
        title: "12. Termination and law",
        paragraphs: [
          `These terms are governed by the law of ${LEGAL.governingLaw}, unless mandatory law provides otherwise.`,
          "After subscription termination, the tenant may lose access to the platform. Data is deleted, anonymised or retained according to applicable law, the agreement, the DPA and technical retention rules.",
        ],
      },
    ],
    linksTitle: "Related documents",
    links: [
      { label: "Privacy Policy", route: "privacy" },
      { label: "Data Processing Agreement", route: "dpa" },
      { label: "Subprocessors", route: "subprocessors" },
      { label: "Security", route: "security" },
    ] as const,
  },
};

const TermsOfService = () => {
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

export default TermsOfService;
