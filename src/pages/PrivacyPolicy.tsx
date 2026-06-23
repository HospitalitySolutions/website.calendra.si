import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL, LEGAL_FULL_ADDRESS, RETENTION_CATEGORIES } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { SITE_HOST } from "@/lib/site";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Politika zasebnosti",
    title: `Politika zasebnosti za ${SITE_HOST} in Calendra`,
    intro: "Ta politika pojasnjuje, kako Calendra obdeluje osebne podatke pri uporabi spletne strani, platforme, tenant aplikacije, Calendra Guest aplikacije, integracij in podpore.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    controllerTitle: "1. Upravljavec in kontakt",
    controllerIntro: "Za obdelave, pri katerih Calendra sama določa namen in sredstva obdelave, je upravljavec:",
    controllerProcessorTitle: "2. Kdaj je Calendra upravljavec in kdaj obdelovalec",
    controllerProcessorParagraphs: [
      "Calendra nastopa kot upravljavec za podatke, ki jih obdeluje za svoje poslovanje: spletna stran, povpraševanja, prodaja, naročnine, obračun, podpora, varnost, pravne obveznosti in komunikacija s potencialnimi ali obstoječimi najemniki.",
      "Calendra praviloma nastopa kot obdelovalec, kadar obdeluje podatke strank, gostov, terminov, računov, komunikacije, datotek in drugih zapisov v imenu najemnika. V takih primerih je najemnik običajno upravljavec in določa namen obdelave.",
      "Kadar posameznik uveljavlja pravice za podatke, ki jih v Calendri vodi najemnik, lahko Calendra zahtevo preusmeri ali pomaga najemniku pri obravnavi zahteve.",
    ],
    dataTitle: "3. Kategorije osebnih podatkov",
    dataBullets: [
      "podatki najemnika in uporabnikov: ime, e-pošta, telefon, podjetje, vloga, prijavni podatki in nastavitve računa,",
      "podatki gostov in strank najemnikov: ime, kontaktni podatki, termin, storitev, komunikacija, članarine, ugodnosti, tečaji in povezani zapisi,",
      "obračunski podatki: naročila, računi, plačila, davčni in naslovni podatki, kadar so potrebni,",
      "integracijski podatki: Google, Zoom, Stripe, Apple, Firebase/push in druge omogočene povezave,",
      "tehnični podatki: IP naslov, naprava, brskalnik, dnevniki, varnostni dogodki in dostavni statusi sporočil,",
      "datoteke in vsebine, ki jih uporabnik ali najemnik naloži ali ustvari v platformi, kadar je funkcija omogočena.",
    ],
    purposesTitle: "4. Nameni in pravne podlage",
    purposesBullets: [
      "zagotavljanje in vzdrževanje platforme Calendra,",
      "ustvarjanje in upravljanje uporabniških računov, terminov, naročil, računov, plačil, sporočil in obvestil,",
      "izvajanje naročniškega razmerja in podpora uporabnikom,",
      "varnost, preprečevanje zlorab, odpravljanje napak in diagnostika,",
      "izpolnjevanje zakonskih obveznosti, zlasti računovodskih, davčnih, pravnih in varnostnih obveznosti,",
      "obdelava po navodilih najemnika, kadar Calendra nastopa kot obdelovalec.",
    ],
    googleTitle: "5. Google API Services User Data Policy in Limited Use disclosure",
    googleParagraphs: [
      "The use and transfer of raw or derived user data received from Google Workspace APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
      "Uporaba in prenos neobdelanih ali izpeljanih uporabniških podatkov, prejetih prek Google Workspace API-jev, sta skladna z Google API Services User Data Policy, vključno z zahtevami Limited Use.",
      "Google uporabniških podatkov ne prodajamo, jih ne uporabljamo za oglaševanje ali profiliranje tretjih oseb in jih delimo le v obsegu, ki je potreben za zagotavljanje funkcionalnosti, ki jo uporabnik sam omogoči v aplikaciji Calendra.",
    ],
    retentionTitle: "6. Hramba podatkov",
    retentionIntro: "Podatke hranimo samo toliko časa, kolikor je potrebno za opisane namene, zakonske obveznosti, varnost, zahtevke ali navodila najemnika.",
    recipientsTitle: "7. Prejemniki, podobdelovalci in prenosi",
    recipientsParagraphs: [
      "Podatke lahko obdelujejo naši ponudniki infrastrukture, plačil, komunikacij, mobilnih storitev, integracij, podpore in varnosti, kadar je to potrebno za delovanje Calendra.",
      "Aktualen seznam podobdelovalcev je objavljen na strani Podobdelovalci. Če pride do prenosa podatkov izven Evropskega gospodarskega prostora, uporabljamo ustrezne zaščitne ukrepe ali drugo veljavno pravno podlago.",
    ],
    cookiesTitle: "8. Piškotki in analitika",
    cookiesParagraphs: [
      LEGAL.websiteAnalyticsEnabled
        ? "Spletna stran lahko uporablja analitične piškotke ali podobne tehnologije v skladu s politiko piškotkov in nastavitvami soglasja."
        : "Spletna stran trenutno ne uporablja analitičnih ali oglaševalskih piškotkov. Lahko uporablja nujne tehnične piškotke ali lokalno shranjevanje za delovanje spletne strani in izbiro jezika.",
    ],
    aiTitle: "9. AI funkcionalnosti",
    aiParagraphs: [
      LEGAL.aiEnabledAtProductionLaunch
        ? "Calendra lahko uporablja izbrane AI funkcionalnosti. Podrobnosti so objavljene na strani AI transparentnost."
        : "AI funkcionalnosti niso omogočene ob začetku produkcije. Če jih omogočimo kasneje, bomo uporabnike obvestili in posodobili stran AI transparentnost ter povezane nastavitve.",
    ],
    rightsTitle: "10. Pravice posameznikov",
    rightsParagraphs: [
      "V skladu z veljavno zakonodajo lahko zahtevate dostop, popravek, izbris, omejitev obdelave, ugovor, prenosljivost in preklic soglasja, kadar so za to izpolnjeni pogoji.",
      "Za podatke, ki jih v Calendri vodi najemnik kot upravljavec, je običajno pravi prvi kontakt najemnik. Calendra bo najemniku pomagala, kadar nastopa kot obdelovalec.",
    ],
    contactTitle: "11. Kontakt",
    contactIntro: "Za vprašanja glede zasebnosti nam pišite na:",
    linksTitle: "Povezani dokumenti",
    links: [
      { label: "Pogodba o obdelavi podatkov", route: "dpa" },
      { label: "Podobdelovalci", route: "subprocessors" },
      { label: "Piškotki", route: "cookies" },
      { label: "Pravice posameznikov", route: "dataRights" },
      { label: "Izbris računa", route: "accountDeletion" },
    ] as const,
  },
  en: {
    badge: "Privacy Policy",
    title: `Privacy Policy for ${SITE_HOST} and Calendra`,
    intro: "This policy explains how Calendra processes personal data when users interact with the website, platform, tenant app, Calendra Guest app, integrations and support.",
    lastUpdated: "Last updated: 23 June 2026",
    controllerTitle: "1. Controller and contact",
    controllerIntro: "For processing where Calendra determines the purposes and means of processing, the controller is:",
    controllerProcessorTitle: "2. When Calendra is controller and when it is processor",
    controllerProcessorParagraphs: [
      "Calendra acts as controller for data processed for its own business: website, inquiries, sales, subscriptions, billing, support, security, legal obligations and communication with prospective or existing tenants.",
      "Calendra generally acts as processor where it processes customer, guest, appointment, invoice, communication, file and other records on behalf of a tenant. In those cases, the tenant is usually the controller and determines the purpose of processing.",
      "Where an individual exercises rights regarding data held in Calendra by a tenant, Calendra may redirect the request or assist the tenant with handling it.",
    ],
    dataTitle: "3. Categories of personal data",
    dataBullets: [
      "tenant and user data: name, email, phone, company, role, login data and account settings,",
      "guest and tenant customer data: name, contact details, appointment, service, communication, memberships, entitlements, courses and related records,",
      "billing data: orders, invoices, payments, tax and address data where required,",
      "integration data: Google, Zoom, Stripe, Apple, Firebase/push and other enabled connections,",
      "technical data: IP address, device, browser, logs, security events and message delivery statuses,",
      "files and content uploaded or created by a user or tenant in the platform where the feature is enabled.",
    ],
    purposesTitle: "4. Purposes and legal bases",
    purposesBullets: [
      "providing and maintaining the Calendra platform,",
      "creating and managing user accounts, appointments, orders, invoices, payments, messages and notifications,",
      "performing subscription relationships and user support,",
      "security, abuse prevention, debugging and diagnostics,",
      "complying with legal obligations, especially accounting, tax, legal and security obligations,",
      "processing on tenant instructions where Calendra acts as processor.",
    ],
    googleTitle: "5. Google API Services User Data Policy and Limited Use disclosure",
    googleParagraphs: [
      "The use and transfer of raw or derived user data received from Google Workspace APIs will adhere to the Google API Services User Data Policy, including the Limited Use requirements.",
      "We do not sell Google user data, do not use it for advertising or third-party profiling, and share it only to the extent needed to provide functionality that the user enables in Calendra.",
    ],
    retentionTitle: "6. Data retention",
    retentionIntro: "We keep data only for as long as needed for the described purposes, legal obligations, security, claims or tenant instructions.",
    recipientsTitle: "7. Recipients, subprocessors and transfers",
    recipientsParagraphs: [
      "Data may be processed by our infrastructure, payment, communication, mobile service, integration, support and security providers where required to operate Calendra.",
      "The current subprocessor list is published on the Subprocessors page. If data is transferred outside the European Economic Area, we use appropriate safeguards or another valid legal basis.",
    ],
    cookiesTitle: "8. Cookies and analytics",
    cookiesParagraphs: [
      LEGAL.websiteAnalyticsEnabled
        ? "The website may use analytics cookies or similar technologies according to the Cookie Policy and consent settings."
        : "The website does not currently use analytics or advertising cookies. It may use strictly necessary technical cookies or local storage for website operation and language choice.",
    ],
    aiTitle: "9. AI features",
    aiParagraphs: [
      LEGAL.aiEnabledAtProductionLaunch
        ? "Calendra may use selected AI features. Details are published on the AI Transparency page."
        : "AI features are not enabled at production launch. If we enable them later, we will inform users and update the AI Transparency page and related settings.",
    ],
    rightsTitle: "10. Data subject rights",
    rightsParagraphs: [
      "According to applicable law, you may request access, rectification, erasure, restriction, objection, portability and withdrawal of consent where the conditions are met.",
      "For data held in Calendra by a tenant as controller, the correct first contact is usually the tenant. Calendra will assist the tenant where it acts as processor.",
    ],
    contactTitle: "11. Contact",
    contactIntro: "For privacy questions, contact:",
    linksTitle: "Related documents",
    links: [
      { label: "Data Processing Agreement", route: "dpa" },
      { label: "Subprocessors", route: "subprocessors" },
      { label: "Cookie Policy", route: "cookies" },
      { label: "Data Rights", route: "dataRights" },
      { label: "Account Deletion", route: "accountDeletion" },
    ] as const,
  },
};

const PrivacyPolicy = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={c.controllerTitle}>
        <p>{c.controllerIntro}</p>
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-5">
          <p><strong className="text-foreground">{LEGAL.entityName}</strong></p>
          <p>{LEGAL_FULL_ADDRESS}</p>
          <p><a className="underline underline-offset-4" href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a></p>
        </div>
      </LegalSection>

      <LegalSection title={c.controllerProcessorTitle}>
        {c.controllerProcessorParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.dataTitle}>
        <LegalList items={c.dataBullets} />
      </LegalSection>

      <LegalSection title={c.purposesTitle}>
        <LegalList items={c.purposesBullets} />
      </LegalSection>

      <LegalSection id="google-limited-use" title={c.googleTitle} tone="highlight">
        {c.googleParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.retentionTitle}>
        <p>{c.retentionIntro}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {RETENTION_CATEGORIES.map((item) => (
            <div key={item.label[language]} className="rounded-2xl border border-border/60 bg-background/70 p-5">
              <h3 className="text-base font-semibold text-foreground">{item.label[language]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary[language]}</p>
            </div>
          ))}
        </div>
      </LegalSection>

      <LegalSection title={c.recipientsTitle}>
        {c.recipientsParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.cookiesTitle}>
        {c.cookiesParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.aiTitle}>
        {c.aiParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.rightsTitle}>
        {c.rightsParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection id="kontakt-in-pravice" title={c.contactTitle}>
        <p>{c.contactIntro} <a className="underline underline-offset-4" href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.</p>
        <LegalNotice>{language === "sl" ? "Za splošno podporo uporabite isti kontakt: " : "For general support, use the same contact: "}<a className="underline underline-offset-4" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.</LegalNotice>
      </LegalSection>

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

export default PrivacyPolicy;
