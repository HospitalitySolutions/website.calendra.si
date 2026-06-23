import { LegalDocument, LegalSection, LegalNotice } from "@/components/legal/LegalDocument";
import { LEGAL, SUBPROCESSORS } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Podobdelovalci",
    title: "Seznam podobdelovalcev Calendra",
    intro: "Ta stran opisuje ponudnike, ki lahko sodelujejo pri zagotavljanju storitve Calendra in pri tem obdelujejo osebne podatke v našem imenu ali v okviru integracij.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    notice: "Seznam se lahko spremeni, če dodamo, zamenjamo ali odstranimo ponudnika. Najemnike bomo o bistvenih spremembah obvestili v skladu s Pogodbo o obdelavi podatkov.",
    tableTitle: "Trenutni podobdelovalci in integracijski ponudniki",
    provider: "Ponudnik",
    purpose: "Namen",
    data: "Kategorije podatkov",
    region: "Regija / lokacija",
    safeguard: "Zaščitni ukrepi",
    contactTitle: "Vprašanja",
    contact: `Za vprašanja glede podobdelovalcev pišite na ${LEGAL.privacyEmail}.`,
  },
  en: {
    badge: "Subprocessors",
    title: "Calendra subprocessor list",
    intro: "This page describes providers that may help deliver Calendra and process personal data on our behalf or as part of enabled integrations.",
    lastUpdated: "Last updated: 23 June 2026",
    notice: "This list may change if we add, replace or remove a provider. We will notify tenants of material changes according to the Data Processing Agreement.",
    tableTitle: "Current subprocessors and integration providers",
    provider: "Provider",
    purpose: "Purpose",
    data: "Data categories",
    region: "Region / location",
    safeguard: "Safeguards",
    contactTitle: "Questions",
    contact: `For questions about subprocessors, contact ${LEGAL.privacyEmail}.`,
  },
};

const Subprocessors = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated} className="max-w-6xl">
      <LegalSection title={c.tableTitle}>
        <LegalNotice>{c.notice}</LegalNotice>
        <div className="overflow-x-auto rounded-2xl border border-border/60">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-muted/60 text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">{c.provider}</th>
                <th className="px-4 py-3 font-semibold">{c.purpose}</th>
                <th className="px-4 py-3 font-semibold">{c.data}</th>
                <th className="px-4 py-3 font-semibold">{c.region}</th>
                <th className="px-4 py-3 font-semibold">{c.safeguard}</th>
              </tr>
            </thead>
            <tbody>
              {SUBPROCESSORS.map((item) => (
                <tr key={item.name} className="border-t border-border/60 align-top">
                  <td className="px-4 py-4 font-medium text-foreground">{item.name}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.purpose[language]}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.dataCategories[language]}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.region}</td>
                  <td className="px-4 py-4 text-muted-foreground">{item.safeguard[language]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LegalSection>
      <LegalSection title={c.contactTitle}>
        <p>{c.contact}</p>
      </LegalSection>
    </LegalDocument>
  );
};

export default Subprocessors;
