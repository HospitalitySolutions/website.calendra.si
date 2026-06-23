import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Varnost",
    title: "Varnost pri Calendri",
    intro: "Ta stran vsebuje javni povzetek varnostnih ukrepov, ki jih uporabljamo za zaščito platforme Calendra in podatkov uporabnikov. Ne razkriva občutljivih notranjih podrobnosti sistema.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    sections: [
      {
        title: "1. Tehnični in organizacijski ukrepi",
        bullets: [
          "Šifriran prenos podatkov prek HTTPS/TLS.",
          "Ločevanje podatkov najemnikov na aplikacijski in podatkovni ravni glede na zasnovo sistema.",
          "Avtentikacija, vloge in omejevanje dostopa glede na pooblastila uporabnika.",
          "Varnostne nastavitve produkcijskega okolja, vključno z ločenimi produkcijskimi skrivnostmi.",
          "Varnostne kopije in postopki obnove, ki jih je treba redno testirati.",
          "Dnevniki, nadzor, omejevanje hitrosti zahtevkov in zaščita javnih endpointov, kjer je to primerno.",
        ],
      },
      {
        title: "2. Gostovanje in infrastruktura",
        paragraphs: [`Produkcijska infrastruktura uporablja ${LEGAL.hostingRegion}. Podrobnosti infrastrukture, omrežja, skrivnosti, notranji diagrami in varnostni pragovi niso javno objavljeni.`],
      },
      {
        title: "3. Incidenti in prijava ranljivosti",
        paragraphs: [
          "Če odkrijete varnostno ranljivost ali sum zlorabe, nas kontaktirajte čim prej. Prosimo, da ranljivosti ne zlorabljate, ne dostopate do tujih podatkov in ne javno objavite podrobnosti pred našim odzivom.",
          `Varnostni kontakt: ${LEGAL.supportEmail}.`,
        ],
      },
      {
        title: "4. Omejitev javnega povzetka",
        paragraphs: ["Ta stran je namenjena zaupanju in preglednosti. Ne nadomešča celotnih notranjih varnostnih politik, postopkov odziva na incidente, DPIA, evidence dejavnosti obdelave ali pogodbenih obveznosti iz DPA."],
      },
    ],
    notice: "Pred širšim produkcijskim zagonom je priporočljivo izvesti še zunanji ali vsaj dokumentiran notranji varnostni pregled, test izolacije najemnikov, preverjanje javnih endpointov in test obnove varnostne kopije.",
  },
  en: {
    badge: "Security",
    title: "Security at Calendra",
    intro: "This page provides a public summary of security measures used to protect the Calendra platform and user data. It does not disclose sensitive internal system details.",
    lastUpdated: "Last updated: 23 June 2026",
    sections: [
      {
        title: "1. Technical and organisational measures",
        bullets: [
          "Encrypted data transfer over HTTPS/TLS.",
          "Tenant data separation at application and data level according to the system design.",
          "Authentication, roles and access limitation based on user permissions.",
          "Production security configuration, including separate production secrets.",
          "Backups and restore procedures that should be tested regularly.",
          "Logging, monitoring, rate limiting and public endpoint protection where appropriate.",
        ],
      },
      {
        title: "2. Hosting and infrastructure",
        paragraphs: [`Production infrastructure uses ${LEGAL.hostingRegion}. Infrastructure details, network details, secrets, internal diagrams and security thresholds are not publicly disclosed.`],
      },
      {
        title: "3. Incidents and vulnerability reporting",
        paragraphs: [
          "If you discover a security vulnerability or suspect abuse, contact us as soon as possible. Please do not exploit the vulnerability, access data that is not yours or publicly disclose details before we respond.",
          `Security contact: ${LEGAL.supportEmail}.`,
        ],
      },
      {
        title: "4. Limits of this public summary",
        paragraphs: ["This page is intended for trust and transparency. It does not replace full internal security policies, incident response procedures, DPIA, records of processing activities or contractual DPA obligations."],
      },
    ],
    notice: "Before a wider production launch, we recommend an external or documented internal security review, tenant-isolation test, public endpoint review and backup-restore test.",
  },
};

const Security = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={language === "sl" ? "Pomembna opomba" : "Important note"} tone="highlight">
        <LegalNotice>{c.notice}</LegalNotice>
      </LegalSection>
      {c.sections.map((section) => (
        <LegalSection key={section.title} title={section.title}>
          {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.bullets ? <LegalList items={section.bullets} /> : null}
        </LegalSection>
      ))}
    </LegalDocument>
  );
};

export default Security;
