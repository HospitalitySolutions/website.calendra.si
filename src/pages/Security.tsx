import { LegalDocument, LegalList, LegalNotice, LegalSection } from "@/components/legal/LegalDocument";
import { LEGAL } from "@/lib/legal";
import { useSiteLanguage } from "@/lib/site-language";

const copy = {
  sl: {
    badge: "Varnost",
    title: "Varnost pri Calendri",
    intro: "Pregled funkcij za zaščito uporabniških računov in nadzor dostopa do podatkov v Calendri.",
    lastUpdated: "Zadnja posodobitev: 10. oktober 2026",
    sections: [
      {
        title: "1. Zaščita prijave",
        bullets: [
          "Gesla se shranjujejo kot enosmerne zgoščene vrednosti z algoritmom bcrypt.",
          "Poslovni uporabniki lahko vključijo dvostopenjsko prijavo s kodami iz aplikacije za preverjanje pristnosti.",
          "Za izbrane občutljive spremembe varnostnih nastavitev je potrebna ponovna potrditev gesla.",
        ],
      },
      {
        title: "2. Pravice dostopa",
        paragraphs: ["Za poslovne uporabnike Calendra na strežniku preverja dostop do izbrane organizacije in pripadnost izbranega poslovnega prostora tej organizaciji. Dostop do funkcij je odvisen tudi od uporabniške vloge in dodeljenih pravic."],
      },
      {
        title: "3. Pregled prijav in varnostne nastavitve",
        bullets: [
          "Poslovni uporabniki lahko pregledajo aktivne seje in odjavijo druge seje svojega računa.",
          "Na voljo so nastavitve opozoril o spremembah načinov prijave in neobičajnih prijavah.",
          "Sprememba ali ponastavitev gesla prekliče obstoječe prijavne seje poslovnega računa.",
        ],
      },
      {
        title: "4. Varnostni kontakt",
        paragraphs: [
          `Če opazite sumljivo uporabo svojega računa ali želite prijaviti morebitno varnostno težavo, pišite na ${LEGAL.supportEmail}.`,
          "V sporočilo vključite kratek opis in korake za ponovitev težave. Ne pošiljajte gesel, dostopnih ključev ali podatkov drugih uporabnikov.",
        ],
      },
    ],
    notice: "Dodatno preverjanje prijave je izbirno. Vključite ga lahko v nastavitvah poslovnega računa v razdelku Varnost, kjer lahko pregledate tudi aktivne prijavne seje.",
  },
  en: {
    badge: "Security",
    title: "Security at Calendra",
    intro: "An overview of the account security and access controls available in Calendra.",
    lastUpdated: "Last updated: 10 October 2026",
    sections: [
      {
        title: "1. Sign-in protection",
        bullets: [
          "Passwords are stored as one-way hashes using bcrypt.",
          "Business users can enable two-factor sign-in with codes from an authenticator app.",
          "Selected sensitive changes to security settings require password confirmation.",
        ],
      },
      {
        title: "2. Access permissions",
        paragraphs: ["For business users, Calendra checks on the server whether the user has access to the selected organisation and whether the selected business location belongs to that organisation. Access to features also depends on the user's role and assigned permissions."],
      },
      {
        title: "3. Session review and security settings",
        bullets: [
          "Business users can review active sessions and sign out other sessions of their account.",
          "Security settings include alerts for changes to sign-in methods and unusual sign-ins.",
          "Changing or resetting a password revokes existing sign-in sessions for the business account.",
        ],
      },
      {
        title: "4. Security contact",
        paragraphs: [
          `If you notice suspicious use of your account or want to report a potential security issue, email ${LEGAL.supportEmail}.`,
          "Include a short description and the steps to reproduce the issue. Do not send passwords, access keys or other users' data.",
        ],
      },
    ],
    notice: "Additional sign-in verification is optional. Business users can enable it and review active sign-in sessions in their account's Security settings.",
  },
};

const Security = () => {
  const { language } = useSiteLanguage();
  const c = copy[language];

  return (
    <LegalDocument badge={c.badge} title={c.title} intro={c.intro} lastUpdated={c.lastUpdated}>
      <LegalSection title={language === "sl" ? "Nastavitve vašega računa" : "Your account settings"} tone="highlight">
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
