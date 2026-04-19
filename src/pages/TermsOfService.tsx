import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SITE_HOST } from "@/lib/site";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { FileText, Scale, ShieldCheck, AlertTriangle, Mail, Building2 } from "lucide-react";

const sections = [
  {
    icon: FileText,
    title: "1. Splošno",
    content: [
      `Ti pogoji uporabe urejajo dostop do in uporabo javne spletne strani ${SITE_HOST}, ki jo upravlja ${LEGAL.entityName} s poslovnim naslovom ${LEGAL_FULL_ADDRESS}.`,
      `Spletna stran je namenjena predstavitvi rešitve Calendra in poslovni komunikaciji z zainteresiranimi podjetji ter drugimi poslovnimi uporabniki (${LEGAL.audience}).`,
    ],
  },
  {
    icon: Building2,
    title: "2. Narava spletne strani",
    content: [
      "Vsebina na tej spletni strani je informativne narave. Objavljene informacije, opisi funkcionalnosti in predstavitve primerov uporabe ne pomenijo samodejne ponudbe za sklenitev pogodbe, razen če je izrecno navedeno drugače.",
      "Dostop do aplikacije Calendra, naročniških funkcionalnosti ali drugih storitev je lahko urejen z ločenimi pogodbenimi pogoji, ponudbami ali posebnimi pogoji uporabe.",
    ],
  },
  {
    icon: Scale,
    title: "3. Dovoljena uporaba",
    content: [
      "Spletno stran lahko uporabljate le zakonito, v skladu s temi pogoji in na način, ki ne posega v varnost, delovanje ali dostopnost strani.",
      "Ni dovoljeno poskušati nepooblaščeno dostopati do strežnika, izvajati avtomatiziranih napadov, kopirati vsebine v nasprotju z veljavno zakonodajo ali uporabljati strani za zavajajoče oziroma protipravne namene.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "4. Intelektualna lastnina",
    content: [
      "Vsebine na spletni strani, vključno z besedili, grafiko, logotipi, dizajnom in drugimi elementi, so v lasti upravljavca ali njegovih partnerjev oziroma se uporabljajo na podlagi ustreznih pravic.",
      "Brez predhodnega pisnega dovoljenja ni dovoljeno reproducirati, distribuirati, javno prikazovati ali drugače komercialno uporabljati bistvenih delov vsebine, razen v obsegu, ki ga dovoljuje zakon.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "5. Omejitev odgovornosti",
    content: [
      "Prizadevamo si, da so informacije na spletni strani točne, ažurne in uporabne, vendar ne jamčimo, da bodo vedno popolne, brez napak ali primerne za vsak posamezen namen.",
      "V največjem obsegu, ki ga dovoljuje zakon, ne odgovarjamo za posredno škodo, izgubljeni dobiček, izpad poslovanja, izgubo podatkov ali drugo škodo, ki bi nastala zaradi uporabe ali nezmožnosti uporabe te spletne strani.",
      `To ne izključuje odgovornosti v primerih, ko je takšne omejitve po pravu države ${LEGAL.governingLaw} nedopustno omejiti ali izključiti.`,
    ],
  },
  {
    icon: Mail,
    title: "6. Kontakt, pravo in spremembe",
    content: [
      `Za vprašanja glede spletne strani ali teh pogojev nas lahko kontaktirate na ${LEGAL.generalEmail}.`,
      `Za te pogoje se uporablja pravo države ${LEGAL.governingLaw}, razen če veljavna prisilna zakonodaja določa drugače.`,
      "Te pogoje lahko občasno posodobimo. Na tej strani bo objavljena aktualna različica z datumom zadnje posodobitve.",
    ],
  },
];

const TermsOfService = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              Pogoji uporabe
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              Pogoji uporabe spletne strani
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Ti javno objavljeni pogoji uporabe veljajo za predstavitveno spletno stran Calendra.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Zadnja posodobitev: 8. april 2026</span>
              <span className="rounded-full bg-muted px-3 py-1">Upravljavec: {LEGAL.entityName}</span>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Osnovni podatki</h2>
          <div className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
            <p><strong className="text-foreground">Naziv:</strong> {LEGAL.entityName}</p>
            <p><strong className="text-foreground">Naslov:</strong> {LEGAL_FULL_ADDRESS}</p>
            <p><strong className="text-foreground">Kontakt:</strong> <a className="underline underline-offset-4" href={`mailto:${LEGAL.generalEmail}`}>{LEGAL.generalEmail}</a></p>
          </div>
        </section>

        <div className="mt-8 space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <section.icon className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{section.title}</h2>
              </div>
              <div className="space-y-4 text-base leading-7 text-muted-foreground">
                {section.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default TermsOfService;
