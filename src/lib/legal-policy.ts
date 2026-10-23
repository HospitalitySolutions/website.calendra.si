/** Owner-approved decisions, 23 October 2026. These are policy, not production configuration. */
export const LEGAL_POLICY = {
  version: "0.4",
  updated: "2026-10-23",
  taxNumber: "10550631",
  vatId: "SI10550631",
  vatEffectiveFrom: "2026-11-01",
  basicMonthlyNetFromNovember: 15.9,
  renewalNoticeDays: 30,
  invoiceDueDays: 14,
  reminderDaysOverdue: 7,
  restrictAfterReceiptDays: 30,
  support: { start: "08:00", end: "20:00", timeZone: "Europe/Ljubljana", urgentHours: 12, ordinaryHours: [24, 48], everyDay: true },
  notesStorage: "Amazon S3",
  textSupportLive: true,
  questionCaptureLive: true,
  voiceLive: false,
  savedQuestionRetention: { minimumDays: 7, maximumDays: 14, productionVerified: false },
  legalReviewComplete: false,
} as const;

export type LegalLanguage = "sl" | "en";
export type LegalText = readonly [sl: string, en: string];
export const legalText = (sl: string, en: string): LegalText => [sl, en];
export const localizeLegal = (text: LegalText, language: LegalLanguage) => text[language === "sl" ? 0 : 1];

export const SUPPORT_HOURS = legalText(
  "Vsak dan 08:00–20:00 po slovenskem lokalnem času (Europe/Ljubljana), tudi ob koncih tedna in praznikih. Upoštevajo se sezonski premiki ure.",
  "Every day, 08:00–20:00 Slovenian local time (Europe/Ljubljana), including weekends and public holidays. Seasonal clock changes apply.",
);
export const SUPPORT_RESPONSE = legalText(
  "Prvi vsebinski odgovor: nujne zadeve v 12 urah podpore; druge zadeve v 24–48 urah podpore, najpozneje v 48 urah podpore. Ure se štejejo samo znotraj navedenega dnevnega okna; ponoči se štetje ustavi. To niso zajamčeni roki odprave napake, samodejna potrditev prejema ali odgovor AI pa ne štejeta kot vsebinski odgovor človeka.",
  "First substantive response: urgent matters within 12 support hours; other matters within 24–48 support hours, with 48 as the maximum. Only hours within the daily support window count; the clock pauses overnight. These are not guaranteed resolution times. An automated acknowledgement or AI answer does not count as a substantive human response.",
);
export const SAVED_QUESTION_RETENTION = legalText(
  "Potrjena politika hrambe shranjenih vprašanj za AI-podporo je 7–14 dni od prvotne oddaje, z največ 14 dnevi v aktivni zbirki vprašanj. Uveljavitev tega roka v produkcijski nastavitvi in postopku izbrisa je še v preverjanju; ta stran ne potrjuje, da je samodejni izbris že preverjen. Za informacije o konkretni hrambi ali zahtevo za izbris pišite na info@calendra.si.",
  "The approved retention policy for saved AI-support questions is 7–14 days from original submission, with a maximum of 14 days in the active question store. Enforcement in the production setting and deletion process is still being verified; this page does not certify that automatic deletion has been verified. Contact info@calendra.si about actual retention or to request deletion.",
);
export const NOTES_SCOPE = legalText(
  "Calendra ponuja shranjevanje opomb in datotek na Amazon S3. To ni samo po sebi potrdilo, da gre za popoln sistem klinične dokumentacije. Za zdravstvene podatke ali zapiske svetovanja morajo biti pred uporabo ustrezno dogovorjeni obseg obdelave, pravne podlage, dostopi, varnost in hramba. Ponudnik ostaja odgovoren za svoje obveznosti obdelovalca; najemnik za zakonitost svojih navodil in strokovne zahteve svoje dejavnosti.",
  "Calendra offers storage of notes and files on Amazon S3. Storage alone does not establish that it is a complete clinical-record system. Before using it for health information or counselling notes, the processing scope, lawful bases, permissions, security and retention must be appropriately agreed and assessed. Calendra remains responsible for its processor obligations; the tenant for lawful instructions and professional requirements of its activity.",
);
