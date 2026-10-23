import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { SUBPROCESSORS } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const Subprocessors = () => {
  const { language } = useSiteLanguage();
  const providers = SUBPROCESSORS.map((provider) => provider.name === "OpenAI" ? { ...provider,
    purpose: { sl: "Aktivna besedilna podpora za uporabo Calendre. Glasovni sistem ni v uporabi.", en: "Live text-based assistance with using Calendra. The voice system is not live." },
    dataCategories: { sl: "Oddano vprašanje, omejen pogovorni kontekst in navodila za produkt; ločeno se pri Calendri shranjujejo uporabniška podporna vprašanja.", en: "Submitted question, limited conversation context and product instructions; Calendra separately saves user support questions." },
    safeguard: { sl: "Preveriti je treba dejansko pogodbeno osebo, regijo, pogoje prenosa in nastavitve ponudnikove hrambe. Ne zatrjujemo posebej odobrene ničelne hrambe ali samodejne uporabe opomb strank za AI.", en: "The actual contracting entity, region, transfer terms and provider-retention settings require verification. No specially approved zero-retention arrangement or automatic use of client notes for AI is asserted." },
  } : provider.name === "Amazon Web Services (AWS)" ? { ...provider,
    purpose: { sl: "Gostovanje, podatkovne baze, varnostne kopije in ponujeno shranjevanje opomb/datotek na Amazon S3.", en: "Hosting, databases, backups and offered note/file storage on Amazon S3." },
  } : provider);
  return <LegalDocument badge={language === "sl" ? "Ponudniki in integracije" : "Providers and integrations"} title={language === "sl" ? "Podobdelovalci in zunanji ponudniki" : "Subprocessors and external providers"} intro={language === "sl" ? "Pregled storitev glede na omogočene funkcije. Vloga ponudnika je odvisna od konkretne obdelave in pogodbe." : "Overview by enabled function. A provider's role depends on the specific processing and agreement."} lastUpdated={language === "sl" ? "Posodobljeno: 23. oktober 2026" : "Updated: 23 October 2026"}>
    <LegalSection title={language === "sl" ? "Obseg in status registra" : "Scope and register status"}>
      <p>{language === "sl" ? "Ta pregled vključuje infrastrukturne ponudnike, ponudnike za lastno spletno stran in izbirne integracije. Niso vsi nujno podobdelovalci za vsakega naročnika. Konkretni seznam za DPA mora navesti dejansko pogodbeno osebo, storitev, podatke, lokacijo in zaščito. Natančna razvrstitev ter pogodbe in regije še potrebujejo preveritev; oznaka globalno ni dokaz o dovoljenem prenosu." : "This overview includes infrastructure providers, vendors for Calendra's own website and optional integrations. Not all are necessarily subprocessors for every customer. The DPA register must identify the actual contracting entity, service, data, location and safeguards. Detailed classification, agreements and regions still need verification; the label global is not evidence of a lawful transfer."}</p>
      <p>{language === "sl" ? "O nameravanih dodatkih ali zamenjavah podobdelovalcev upravljavca obvestimo vnaprej in omogočimo smiselno možnost ugovora pred novo obdelavo. Podrobnosti ureja DPA." : "Controllers receive advance notice of intended subprocessor additions or replacements and a meaningful opportunity to object before new processing. The DPA governs the details."}</p>
    </LegalSection>
    {providers.map((provider) => <LegalSection key={provider.name} title={provider.name}><p>{provider.purpose[language]}</p><p><strong>{language === "sl" ? "Podatki: " : "Data: "}</strong>{provider.dataCategories[language]}</p><p><strong>{language === "sl" ? "Pregled regije: " : "Region overview: "}</strong>{provider.region}</p><p>{provider.safeguard[language]}</p></LegalSection>)}
    <LegalSection title={language === "sl" ? "Povezani dokumenti" : "Related documents"}><p><a className="underline underline-offset-4" href={getRoutePath("dpa", language)}>{language === "sl" ? "Pogodba o obdelavi podatkov" : "Data Processing Agreement"}</a>{" · "}<a className="underline underline-offset-4" href={getRoutePath("aiTransparency", language)}>{language === "sl" ? "AI transparentnost in hramba" : "AI transparency and retention"}</a></p></LegalSection>
  </LegalDocument>;
};
export default Subprocessors;
