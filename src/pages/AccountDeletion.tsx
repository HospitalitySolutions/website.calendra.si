import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Calendra Guest App",
    title: "Izbris računa Calendra Guest",
    intro: "Ta javna stran pojasnjuje, kako lahko gost izbriše svoj račun v Calendra Guest mobilni aplikaciji ali zahteva izbris, če do aplikacije nima več dostopa.",
    lastUpdated: "Zadnja posodobitev: 23. junij 2026",
    appTitle: "1. Izbris neposredno v aplikaciji",
    appParagraphs: [
      "Račun lahko izbrišete neposredno v Calendra Guest mobilni aplikaciji: Profil → Izbris računa.",
      "V aplikaciji se prikaže pojasnilo, kateri podatki se izbrišejo ali anonimizirajo in kateri zapisi se lahko hranijo zaradi zakonskih, računovodskih, varnostnih ali dokaznih razlogov.",
      "Po potrditvi se račun deaktivira, podatki se izbrišejo ali anonimizirajo, potisna obvestila se prekličejo in uporabnik je odjavljen.",
    ],
    webTitle: "2. Če do aplikacije ne morete dostopati",
    webParagraph: "Če do aplikacije ne morete dostopati, lahko zahtevo pošljete po e-pošti. Vključite e-poštni naslov, ki ste ga uporabljali za Calendra Guest račun, in po potrebi telefonsko številko, da lahko identificiramo račun.",
    mailLabel: "Pošlji zahtevo za izbris",
    privacyLabel: "Politika zasebnosti",
    deletedTitle: "3. Podatki, ki se običajno izbrišejo ali anonimizirajo",
    deletedItems: [
      "profilni podatki računa gosta, kot so ime, e-pošta, telefon in nastavitve,",
      "prijavni podatki in povezani identifikatorji, ki niso več potrebni,",
      "profilna slika in uporabniške nastavitve, kjer niso potrebne za zakonske ali varnostne razloge,",
      "povezave z najemniki in povezani profili strank, kjer je izbris ali anonimizacija pravno in tehnično mogoča,",
      "potisni žetoni naprav in aktivne zahteve za ponastavitev gesla.",
    ],
    retainedTitle: "4. Podatki, ki se lahko hranijo",
    retainedItems: [
      "računi, plačila, naročila, dobropisi, davčne in računovodske evidence, kadar je hramba zakonsko potrebna,",
      "varnostni in tehnični dnevniki za omejeno obdobje zaradi zaščite pred zlorabami,",
      "podatki, ki jih najemnik hrani kot del svojih zakonskih ali poslovnih evidenc, kjer popoln izbris ni mogoč ali ni dovoljen.",
    ],
    timingTitle: "5. Rok obravnave",
    timingParagraph: "Zahteve običajno obravnavamo v 30 dneh po preverjanju identitete in razjasnitvi morebitnih obveznosti hrambe.",
    note: "Izbris računa Calendra Guest ne izbriše samodejno vseh zapisov, ki jih posamezen najemnik zakonito hrani kot upravljavec. Za takšne zapise je običajno pravi kontakt najemnik.",
  },
  en: {
    badge: "Calendra Guest App",
    title: "Calendra Guest account deletion",
    intro: "This public page explains how guests can delete their Calendra Guest account in the mobile app or request deletion if they no longer have access to the app.",
    lastUpdated: "Last updated: 23 June 2026",
    appTitle: "1. Delete directly in the app",
    appParagraphs: [
      "You can delete your account directly in the Calendra Guest mobile app: Profile → Delete account.",
      "The app displays an explanation of which data will be deleted or anonymised and which records may be retained for legal, accounting, security or evidentiary reasons.",
      "After confirmation, the account is deactivated, data is deleted or anonymised, push notifications are revoked and the user is signed out.",
    ],
    webTitle: "2. If you cannot access the app",
    webParagraph: "If you cannot access the app, you can send a deletion request by email. Include the email address used for the Calendra Guest account and, where relevant, the phone number so we can identify the account.",
    mailLabel: "Email deletion request",
    privacyLabel: "Privacy Policy",
    deletedTitle: "3. Data usually deleted or anonymised",
    deletedItems: [
      "guest account profile data such as name, email, phone and settings,",
      "login data and related identifiers that are no longer needed,",
      "profile picture and user preferences where not required for legal or security reasons,",
      "tenant links and related client profiles where deletion or anonymisation is legally and technically possible,",
      "device push tokens and active password reset requests.",
    ],
    retainedTitle: "4. Data that may be retained",
    retainedItems: [
      "invoices, payments, orders, credit notes, tax and accounting records where retention is legally required,",
      "security and technical logs for a limited period to protect against abuse,",
      "data retained by a tenant as part of its statutory or business records where full deletion is not possible or not permitted.",
    ],
    timingTitle: "5. Processing time",
    timingParagraph: "We normally process requests within 30 days after identity verification and clarification of any retention obligations.",
    note: "Deleting a Calendra Guest account does not automatically delete all records lawfully held by an individual tenant as controller. For those records, the tenant is usually the correct contact.",
  },
};

const AccountDeletion = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];
  const mailSubject = language === "sl" ? "Zahteva za izbris računa Calendra Guest" : "Calendra Guest account deletion request";
  const mailBody =
    language === "sl"
      ? "Pozdravljeni,\n\nprosim za izbris mojega računa Calendra Guest in povezanih osebnih podatkov.\n\nE-pošta uporabljena za račun:\nTelefonska številka, če je bila uporabljena:\n\nHvala."
      : "Hello,\n\nI would like to request deletion of my Calendra Guest account and associated personal data.\n\nEmail used for the guest account:\nPhone number, if used:\n\nThank you.";

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={c.appTitle} tone="highlight">
        {c.appParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </LegalSection>

      <LegalSection title={c.webTitle}>
        <p>{c.webParagraph}</p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
          <Button asChild size="lg" className="font-semibold">
            <a href={`mailto:${LEGAL.privacyEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`}>{c.mailLabel}</a>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-semibold">
            <a href={getRoutePath("privacy", language)}>{c.privacyLabel}</a>
          </Button>
        </div>
      </LegalSection>

      <LegalSection title={c.deletedTitle}>
        <LegalList items={c.deletedItems} />
      </LegalSection>

      <LegalSection title={c.retainedTitle}>
        <LegalList items={c.retainedItems} />
      </LegalSection>

      <LegalSection title={c.timingTitle}>
        <p>{c.timingParagraph}</p>
        <LegalNotice>{c.note}</LegalNotice>
      </LegalSection>
    </LegalDocument>
  );
};

export default AccountDeletion;
