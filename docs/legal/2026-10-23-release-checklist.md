# Legal website revision 0.4 — release and evidence checklist

Owner-confirmed on 23 October 2026; source: approved decisions in Calendra_Legal_Review_Pack_2026-10-23_v04. This file is operational documentation, not a public claim of verified compliance. No production settings, backend code, billing, secrets or analytics configuration are changed by this website PR.

## Confirmed facts reflected in both languages

- VAT ID SI10550631 effective 1 November 2026, not before. B2B prices exclude VAT from that date; Basic monthly EUR 15.90 net. Do not infer a new annual Basic amount or other revised amounts. Preserve signed/prepaid commitments and review transitional tax points with the accountant.
- Initially signed agreement, automatic monthly/annual renewal, written non-renewal at least 30 calendar days before renewal. Late notice can trigger another period. No ordinary change-of-mind refund; preserve mandatory and provider-breach remedies.
- Invoice due 14 calendar days after issue unless the signed order differs. Reminder seven days overdue. Ordinary restriction no earlier than 30 days after actual invoice receipt, after notice; restriction is not deletion. Verify delivery evidence, reminder delivery and the first eligible restriction date.
- Human first response: 12 support hours urgent, 24–48 support hours ordinary (48 maximum); every day 08:00–20:00 Europe/Ljubljana, including weekends/holidays and seasonal clock changes. Night hours excluded. No resolution or uptime guarantee invented. Breach duties do not pause.
- S3 note/file storage is offered. It does not prove clinical-record suitability, complete tenant-field isolation, encryption, backup or recovery settings. Sensitive-data scope needs specific assessment.
- Text support and question capture live; voice not live. Approved question retention 7–14 days, no more than 14 from original submission in the active store. This is not the S3 notes retention period.

## Open gates — do not claim these are complete

1. **Saved questions:** app repository docs/ai-support-admin-implementation.md describes a historical 30-day default adjustable 7–90 and a periodic purge job. Read actual deployed settings; set the approved 7–14-day period, tighten existing expirations, verify purge completion and overdue backlog. The website's LEGAL_POLICY.savedQuestionRetention.productionVerified remains false. It displays the approved policy AND the unverified-enforcement status. Do not remove that qualification without evidence. Check manual exports, editorial samples, backup and provider-held copies separately. Source-document defaults are not production proof.
2. **Legal review and acceptance:** contract pages retain an explicit review notice. Confirm signed contract/DPA versions, durable acceptance evidence, notification of existing customers, multiple-controller authority and annexes. Do not substitute a changed webpage for acceptance or remove the review notice as an SEO-only change.
3. **Infrastructure:** inventory real AWS regions; file access and expiring links; encryption configuration/key access; tenant/record isolation; production support access; backup rotation and restore tests; logs and retention. No invented certification or recovery promise.
4. **Minors:** no adult-only rule was approved. Implement appropriate age, representative-authority and consent safeguards where needed. Do not claim such checks are already enforced. Authority to book does not grant blanket access to confidential records.
5. **Vendors:** confirm legal entities, actual subprocessors vs independent integrations/own-controller vendors, locations, contracts, transfers and advance-change notification/objection workflow. Verify MailerLite/Instantly scope; do not assume tenant records are in those systems.
6. **Other retention/exit:** owner has NOT approved the proposed 30-day retrieval + 30-day active deletion + 90-day backup schedule. Do not publish those as current commitments. Preserve mandatory Data Act switching/retrieval rights, assess scope and charges; no annual renewal lock-in overriding statutory switching.
7. **Cookies:** no change to GA4 Advanced Consent Mode was approved. This PR documents existing pre-consent cookieless traffic; it does not claim GA4 is blocked. Inventory actual cookie/storage keys, lifetimes, suppression handling and lawful bases; consent assessment remains open.
8. **November prices:** this PR publishes the date-qualified rule, not a billing migration or scheduled deployment. Before 1 November separately align the pricing catalog, calculator, gross/net labels, schema, invoice logic and accepted contracts. Do not flip VAT on before the effective date or infer annual Basic prices. Current pricing calculations are deliberately not rewritten here.
9. **Consistency:** psychology marketing distinguishes administrative software from a complete clinical record system. Its earlier blanket therapy-note prohibition needs reconciliation with the newly confirmed S3 storage scope once the permitted sensitive-data scope and controls are approved; no broad clinical-storage certification is granted here.
10. **Support:** confirm urgency classification, incident backup and an alternative emergency channel. Preserve operational ability to meet first-response commitments, separate from AI acknowledgements.

## Validation and deployment

Run the unchanged self-hosted Linux CI only: lint, TypeScript, Vitest, production prerender, sitemap/crawler checks, browser tests, Caddy checks and Lighthouse. Never skip tests or introduce GitHub-hosted fallback. Verify both language variants and security#incidenti / terms#connect anchors. Inspect deployment on every serving node. GitHub publication alone is not production deployment.

## Sources checked 23 October 2026

- GDPR, Regulation (EU) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- EDPB controller/processor contracts: https://www.edpb.europa.eu/sme/learn-the-basics/data-controller-or-data-processor_en
- EDPB breach duties: https://www.edpb.europa.eu/sme/assess-the-risks/data-breaches_en
- EDPB individual rights: https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en
- Slovenian IP child-consent guidance (Article 8 ZVOP-2; context-specific age 15): https://www.ip-rs.si/mnenja-zvop-2/skladnost-aplikacije-z-zakonodajo-o-varstvu-osebnih-podatkov-1746686409
- EU Data Act overview: https://digital-strategy.ec.europa.eu/en/factpages/data-act-explained
- OpenAI API data controls: https://developers.openai.com/api/docs/guides/your-data

No general claim that all GDPR, consumer, tax, Data Act or AI Act obligations have been satisfied is made by these documents.
