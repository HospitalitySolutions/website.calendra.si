import { LegalDocument, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL_NAVIGATION } from "@/components/legal/LegalPolicyPage";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const LegalCenter = () => {
  const { language } = useSiteLanguage();
  return <LegalDocument badge={language === "sl" ? "Pravno in zaupanje" : "Legal & Trust"} title={language === "sl" ? "Pravni dokumenti in zasebnost" : "Legal documents and privacy"} intro={language === "sl" ? "Pogoji naročnine, obdelava podatkov, varnost, aktivna besedilna AI-podpora in vaše pravice." : "Subscription terms, data processing, security, live text AI support and your rights."} lastUpdated={language === "sl" ? "Posodobljeno: 23. oktober 2026 · Različica 0.4" : "Updated: 23 October 2026 · Version 0.4"}>
    <LegalSection title={language === "sl" ? "Dokumenti" : "Documents"}>
      <div className="grid gap-4 md:grid-cols-2">{LEGAL_NAVIGATION.map((item) => <a key={item.key} href={getRoutePath(item.key, language)} className="rounded-2xl border border-border/60 bg-background/70 p-5 font-semibold text-foreground hover:border-primary/40">{item[language]}</a>)}</div>
      <p><a className="underline underline-offset-4" href={`${getRoutePath("security", language)}#incidenti`}>{language === "sl" ? "Prijava in obravnava kršitve osebnih podatkov" : "Reporting and handling a personal-data breach"}</a></p>
      <p><a className="underline underline-offset-4" href={`${getRoutePath("terms", language)}#connect`}>{language === "sl" ? "Ločena pravila za uporabnike Connect in rezervacije" : "Separate Connect and individual-booking rules"}</a></p>
    </LegalSection>
    <LegalSection title={language === "sl" ? "Status dokumentov" : "Document status"}>
      <p>{language === "sl" ? "Potrjena poslovna pravila so vključena. Pogodbeni besedili sta še v pravnem pregledu; odprte tehnične preveritve so izrecno označene. Objavljena različica ne spreminja že podpisane pogodbe za nazaj in ni varnostni certifikat." : "Confirmed commercial rules are incorporated. Contract texts remain under legal review and open technical checks are identified explicitly. Publication does not retrospectively amend signed agreements or constitute a security certification."}</p>
    </LegalSection>
  </LegalDocument>;
};
export default LegalCenter;
