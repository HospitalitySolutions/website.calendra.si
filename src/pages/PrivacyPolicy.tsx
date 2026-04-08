import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { Shield, Lock, Cookie, Database, Mail, Globe } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "1. Kaj zajema ta politika",
    content: [
      `Ta politika zasebnosti velja za javno spletno stran ${SITE_HOST}, ki jo upravlja ${LEGAL.entityName}. Namenjena je pojasnilu, katere podatke lahko zbiramo ob obisku strani, zakaj jih obdelujemo in kakšne pravice imate kot obiskovalec.`,
      "Če se po kliku na prijavo, registracijo ali drugo funkcionalnost premaknete v aplikacijo Calendra ali v storitev tretje osebe, se lahko za takšno obdelavo uporabljajo dodatna pravila ali ločena politika zasebnosti.",
      `Spletna stran je namenjena predvsem poslovnim uporabnikom in podjetjem (${LEGAL.audience}).`,
    ],
  },
  {
    icon: Database,
    title: "2. Katere podatke lahko obdelujemo",
    content: [
      "Ob obisku spletne strani lahko obdelujemo tehnične podatke, kot so IP naslov, datum in čas zahteve, zahtevani URL, osnovni podatki o brskalniku in napravi ter varnostni dnevniki strežnika.",
      "Če nas kontaktirate, lahko obdelujemo tudi podatke, ki nam jih posredujete sami, na primer ime, e-poštni naslov, naziv podjetja in vsebino sporočila.",
      "Na spletni strani ne uporabljamo javno objavljenih marketinških orodij. Če bodo v prihodnje dodana dodatna analitična ali marketinška orodja, bo ta politika ustrezno posodobljena.",
    ],
  },
  {
    icon: Lock,
    title: "3. Nameni in pravne podlage",
    content: [
      "Podatke obdelujemo za delovanje spletne strani, zagotavljanje varnosti, odpravljanje napak, odgovarjanje na povpraševanja ter zaščito pred zlorabami. Takšna obdelava temelji na našem zakonitem interesu za varno in stabilno delovanje spletne strani.",
      "Kadar nam pošljete povpraševanje ali drugo sporočilo, podatke obdelujemo zato, da lahko z vami komuniciramo in odgovorimo na vašo zahtevo oziroma izvedemo korake pred morebitnim poslovnim sodelovanjem.",
      "Če bomo v prihodnje uporabljali neobvezne analitične ali marketinške piškotke, se bo takšna obdelava izvajala na podlagi vašega soglasja, kadar je to zahtevano.",
    ],
  },
  {
    icon: Cookie,
    title: "4. Piškotki in podobne tehnologije",
    content: [
      "Spletna stran lahko uporablja nujno potrebne piškotke za osnovno delovanje, varnost in shranjevanje tehničnih nastavitev. Ti piškotki običajno niso namenjeni profiliranju obiskovalcev.",
      "Če bodo na strani dodani dodatni analitični, funkcionalni ali oglaševalski piškotki, bomo pred njihovo uporabo zagotovili ustrezno obveščanje in mehanizem za soglasje, kadar je to potrebno.",
    ],
  },
  {
    icon: Globe,
    title: "5. Hramba, obdelovalci in prenosi",
    content: [
      "Podatke hranimo le toliko časa, kolikor je potrebno za namen, zaradi katerega so bili zbrani, oziroma toliko časa, kot to zahtevajo zakonodaja, varnostne potrebe ali reševanje zahtevkov in sporov.",
      `Za gostovanje in povezano infrastrukturo uporabljamo zunanjega obdelovalca ${LEGAL.processors.join(', ')}. Takšni ponudniki podatke obdelujejo po naših navodilih in le v obsegu, ki je potreben za izvedbo storitve.`,
      "Če pride do prenosa podatkov izven Evropskega gospodarskega prostora, se ta izvede le ob uporabi ustreznih zaščitnih ukrepov, na primer standardnih pogodbenih klavzul ali druge veljavne pravne podlage.",
    ],
  },
  {
    icon: Mail,
    title: "6. Vaše pravice",
    content: [
      "V skladu z veljavno zakonodajo lahko zahtevate dostop do svojih osebnih podatkov, popravek netočnih podatkov, izbris, omejitev obdelave, ugovor obdelavi ter prenosljivost podatkov, kadar so za to izpolnjeni pogoji.",
      "Če obdelava temelji na soglasju, ga lahko kadar koli prekličete za naprej. Preklic ne vpliva na zakonitost obdelave, izvedene pred preklicem.",
      "Prav tako imate pravico vložiti pritožbo pri Informacijskem pooblaščencu Republike Slovenije ali drugem pristojnem nadzornem organu.",
    ],
  },
];

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <main className="py-16 md:py-20">
      <div className="container mx-auto max-w-4xl px-4 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              Politika zasebnosti
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              Zasebnost na spletni strani {SITE_HOST}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Ta stran pojasnjuje, kako {LEGAL.entityName} na javni predstavitveni spletni strani Calendra obravnava osebne podatke obiskovalcev.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Zadnja posodobitev: 8. april 2026</span>
              <a href={SITE_URL} className="rounded-full bg-muted px-3 py-1 transition-colors hover:text-foreground">
                {SITE_HOST}
              </a>
            </div>
          </div>
        </div>

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Upravljavec osebnih podatkov</h2>
          <div className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
            <p><strong className="text-foreground">Naziv:</strong> {LEGAL.entityName}</p>
            <p><strong className="text-foreground">Naslov:</strong> {LEGAL_FULL_ADDRESS}</p>
            <p><strong className="text-foreground">Splošni kontakt:</strong> <a className="underline underline-offset-4" href={`mailto:${LEGAL.generalEmail}`}>{LEGAL.generalEmail}</a></p>
            <p><strong className="text-foreground">Kontakt za zasebnost in GDPR:</strong> <a className="underline underline-offset-4" href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a></p>
            <p><strong className="text-foreground">Podjetje upravlja tudi aplikacijo Calendra:</strong> {LEGAL.websiteAndAppSameEntity ? 'Da' : 'Ne'}</p>
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

          <section id="kontakt-in-pravice" className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">7. Kontakt glede zasebnosti</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <p>
                Za vprašanja, zahteve ali uveljavljanje pravic glede zasebnosti nam pišite na <a className="underline underline-offset-4" href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a>.
              </p>
              <p>
                Za splošna vprašanja glede spletne strani, storitve ali podpore nas lahko kontaktirate na <a className="underline underline-offset-4" href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
);

export default PrivacyPolicy;
