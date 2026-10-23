import { LegalDocument, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { CONTRACT_REVIEW_NOTICE, LEGAL_DOCUMENTS, type PolicyKey } from "@/lib/legal-documents";
import { LEGAL_POLICY, localizeLegal } from "@/lib/legal-policy";
import { getRoutePath, type CanonicalRouteKey } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { LEGAL } from "@/lib/legal";
import { LOGIN_ROUTE } from "@/lib/routes";

export const LEGAL_NAVIGATION: Array<{ key: CanonicalRouteKey; sl: string; en: string }> = [
  { key: "pricing", sl: "Aktualni cenik", en: "Current pricing" },
  { key: "terms", sl: "Pogoji uporabe", en: "Terms of Service" },
  { key: "dpa", sl: "Pogodba o obdelavi podatkov", en: "Data Processing Agreement" },
  { key: "privacy", sl: "Politika zasebnosti", en: "Privacy Policy" },
  { key: "security", sl: "Varnost in kršitve", en: "Security and breaches" },
  { key: "subprocessors", sl: "Podobdelovalci in integracije", en: "Subprocessors and integrations" },
  { key: "cookies", sl: "Piškotki", en: "Cookies" },
  { key: "aiTransparency", sl: "AI transparentnost", en: "AI Transparency" },
  { key: "dataRights", sl: "Pravice posameznikov", en: "Data rights" },
  { key: "accountDeletion", sl: "Izbris računa", en: "Account deletion" },
  { key: "support", sl: "Podpora", en: "Support" },
];

const LegalPolicyPage = ({ policy }: { policy: PolicyKey }) => {
  const { language } = useSiteLanguage();
  const document = LEGAL_DOCUMENTS[policy];
  const t = (text: Parameters<typeof localizeLegal>[0]) => localizeLegal(text, language);
  const updated = language === "sl" ? "Posodobljeno: 23. oktober 2026" : "Updated: 23 October 2026";
  return (
    <LegalDocument badge={language === "sl" ? "Pravno in zaupanje" : "Legal & Trust"} title={t(document.title)} intro={t(document.intro)} lastUpdated={`${updated} · ${language === "sl" ? "Različica" : "Version"} ${LEGAL_POLICY.version}`}>
      {document.review && !LEGAL_POLICY.legalReviewComplete ? <LegalSection title={language === "sl" ? "Status pogodbenega besedila" : "Contract text status"} tone="warning"><LegalNotice>{t(CONTRACT_REVIEW_NOTICE)}</LegalNotice></LegalSection> : null}
      {document.sections.map((item, index) => <LegalSection key={item.title[1]} id={item.id ?? `section-${index + 1}`} title={t(item.title)}>{item.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{t(paragraph)}</p>)}</LegalSection>)}
      {policy === "support" ? <LegalSection title={language === "sl" ? "Dostop in navodila" : "Access and guides"}>
        <p><a className="underline underline-offset-4" href={LOGIN_ROUTE}>{language === "sl" ? "Odprite aplikacijo Calendra" : "Open the Calendra application"}</a></p>
        <p><a className="underline underline-offset-4" href={getRoutePath("zoom", language)}>{language === "sl" ? "Povezava, uporaba in odklop Zoom integracije" : "Connecting, using and removing the Zoom integration"}</a></p>
      </LegalSection> : null}
      <LegalSection title={language === "sl" ? "Kontakt in povezani dokumenti" : "Contact and related documents"}>
        <p><a href={`mailto:${LEGAL.privacyEmail}`} className="underline underline-offset-4">{LEGAL.privacyEmail}</a>{" · "}<a href={`tel:${LEGAL.supportPhoneTel}`} className="underline underline-offset-4">{LEGAL.supportPhone}</a></p>
        <nav aria-label={language === "sl" ? "Povezani pravni dokumenti" : "Related legal documents"} className="flex flex-wrap gap-3">{LEGAL_NAVIGATION.filter((item) => item.key !== policy).map((item) => <a key={item.key} href={getRoutePath(item.key, language)} className="rounded-xl border border-border/60 px-4 py-2 text-sm font-semibold text-foreground hover:border-primary/40">{item[language]}</a>)}</nav>
      </LegalSection>
    </LegalDocument>
  );
};
export default LegalPolicyPage;
