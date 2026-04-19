import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { SITE_HOST, SITE_URL } from "@/lib/site";
import { LEGAL, LEGAL_FULL_ADDRESS } from "@/lib/legal";
import { Shield, Lock, Cookie, Database, Mail, Globe, Share2 } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "1. Kaj zajema ta politika",
    content: [
      `Ta politika zasebnosti velja za javno spletno stran ${SITE_HOST} in za aplikacijo Calendra, ki ju upravlja ${LEGAL.entityName}. Namenjena je pojasnilu, katere podatke lahko zbiramo, zakaj jih obdelujemo, s kom jih lahko delimo in kakšne pravice imate kot uporabnik ali obiskovalec.`,
      "Ta politika zajema tudi podatke, ki jih obdelujemo, ko se prijavite z Google računom ali ko v aplikaciji Calendra prostovoljno povežete Google koledar oziroma Google Meet za ustvarjanje spletnih terminov.",
      `Storitev je namenjena predvsem poslovnim uporabnikom in podjetjem (${LEGAL.audience}).`,
    ],
  },
  {
    icon: Database,
    title: "2. Katere podatke lahko obdelujemo",
    content: [
      "Ob obisku spletne strani lahko obdelujemo tehnične podatke, kot so IP naslov, datum in čas zahteve, zahtevani URL, osnovni podatki o brskalniku in napravi ter varnostni dnevniki strežnika.",
      "Če nas kontaktirate, lahko obdelujemo tudi podatke, ki nam jih posredujete sami, na primer ime, e-poštni naslov, naziv podjetja in vsebino sporočila.",
      "Če uporabljate aplikacijo Calendra, lahko obdelujemo podatke o uporabniškem računu, organizaciji, terminih, rezervacijah in drugih podatkih, ki jih vnesete v storitev.",
      "Če uporabljate prijavo z Google računom, lahko obdelujemo osnovne identifikacijske podatke, ki nam jih Google posreduje za prijavo, na primer e-poštni naslov in osnovne podatke profila, potrebne za preverjanje ali povezavo vašega računa.",
      "Če v aplikaciji povežete Google koledar oziroma Google Meet, lahko obdelujemo Google OAuth žetone, identifikator povezanega Google računa ter podatke, potrebne za ustvarjanje termina v Google Koledarju, na primer naslov dogodka, datum in čas, časovni pas ter ustvarjeno Google Meet povezavo.",
      "Trenutna Google integracija v aplikaciji zahteva le dovoljenje Google Calendar scope, potrebno za ustvarjanje koledarskih dogodkov in Google Meet povezav za spletne termine.",
    ],
  },
  {
    icon: Lock,
    title: "3. Nameni in pravne podlage",
    content: [
      "Podatke obdelujemo za delovanje spletne strani in aplikacije, zagotavljanje varnosti, odpravljanje napak, odgovarjanje na povpraševanja, vodenje uporabniških računov ter zaščito pred zlorabami. Takšna obdelava temelji na našem zakonitem interesu za varno in stabilno delovanje storitve.",
      "Kadar se prijavite z Google računom ali povežete Google koledar oziroma Google Meet, podatke obdelujemo zato, da omogočimo prijavo, povezavo računa ter ustvarjanje spletnih terminov in povezav za video srečanja. Takšna obdelava temelji na izvajanju storitve, ki jo zahtevate, oziroma na korakih, ki jih sprožite sami v aplikaciji.",
      "Kadar nam pošljete povpraševanje ali drugo sporočilo, podatke obdelujemo zato, da lahko z vami komuniciramo in odgovorimo na vašo zahtevo oziroma izvedemo korake pred morebitnim poslovnim sodelovanjem.",
      "Če bomo v prihodnje uporabljali neobvezne analitične ali marketinške piškotke, se bo takšna obdelava izvajala na podlagi vašega soglasja, kadar je to zahtevano.",
    ],
  },
  {
    icon: Share2,
    title: "4. S kom delimo, prenašamo ali razkrivamo podatke",
    content: [
      "Osebne podatke, vključno z Google uporabniškimi podatki, delimo ali razkrivamo le v obsegu, ki je potreben za delovanje storitve, izpolnitev vaše zahteve, skladnost z zakonodajo ali zaščito naših pravic.",
      `Za gostovanje in povezano infrastrukturo uporabljamo zunanje obdelovalce, trenutno ${LEGAL.processors.join(', ')}. Takšni ponudniki podatke obdelujejo po naših navodilih in le v obsegu, ki je potreben za izvedbo storitve.`,
      "Če uporabite prijavo z Google računom ali povežete Google koledar oziroma Google Meet, se ustrezni podatki izmenjujejo z Googlom, kolikor je to potrebno za avtentikacijo, avtorizacijo in ustvarjanje koledarskih dogodkov oziroma Meet povezav, ki jih sprožite sami v aplikaciji.",
      "Podatke lahko razkrijemo tudi pooblaščenim uporabnikom znotraj iste organizacije oziroma računa, če imajo v aplikaciji dostop do zadevnega koledarskega zapisa, termina ali rezervacije.",
      "Podatke lahko razkrijemo pristojnim organom, sodiščem, regulatorjem ali drugim tretjim osebam, kadar je to potrebno zaradi veljavne zakonodaje, pravnega postopka, izvrševanja naših pogojev ali zaščite pravic, varnosti in premoženja uporabnikov, podjetja ali javnosti.",
      "V primeru združitve, prodaje podjetja, prestrukturiranja ali podobne transakcije se lahko podatki prenesejo na pravnega naslednika ali kupca, ob upoštevanju veljavne zakonodaje.",
      "Google uporabniških podatkov ne prodajamo in jih ne delimo za namene oglaševanja ali profiliranja tretjih oseb.",
    ],
  },
  {
    icon: Cookie,
    title: "5. Piškotki in podobne tehnologije",
    content: [
      "Spletna stran lahko uporablja nujno potrebne piškotke za osnovno delovanje, varnost in shranjevanje tehničnih nastavitev. Ti piškotki običajno niso namenjeni profiliranju obiskovalcev.",
      "Če bodo na strani dodani dodatni analitični, funkcionalni ali oglaševalski piškotki, bomo pred njihovo uporabo zagotovili ustrezno obveščanje in mehanizem za soglasje, kadar je to potrebno.",
    ],
  },
  {
    icon: Globe,
    title: "6. Varstvo občutljivih in Google uporabniških podatkov",
    content: [
      "Za zaščito podatkov uporabljamo razumne tehnične in organizacijske ukrepe, namenjene zmanjšanju tveganja nepooblaščenega dostopa, izgube, zlorabe ali nepooblaščenega razkritja podatkov.",
      "Podatki med vašim brskalnikom, našimi sistemi in podprtimi zunanjimi API storitvami se prenašajo prek zaščitenih povezav HTTPS/TLS, kadar je to podprto in zahtevano za delovanje storitve.",
      "Dostop do podatkov v aplikaciji je omejen na avtenticirane uporabnike in na pooblaščene osebe oziroma sisteme, ki potrebujejo dostop za delovanje, podporo ali varnost storitve.",
      "Pri Google integraciji uporabljamo načelo najmanjšega obsega dovoljenj: aplikacija zahteva le tisti Google Calendar scope, ki je potreben za ustvarjanje dogodkov in Google Meet povezav za spletne termine.",
      "Google OAuth povezovalni podatki se hranijo na strežniški strani za potrebe delovanja integracije; uporabniki lahko povezavo prekličejo v svojem Google oziroma Google Workspace računu, pri nas pa lahko zahtevajo izbris povezanih podatkov v skladu s to politiko in veljavno zakonodajo.",
      "Kljub razumnim zaščitnim ukrepom noben način prenosa ali shranjevanja podatkov ne more biti popolnoma varen, zato absolutne varnosti ne moremo jamčiti.",
    ],
  },
  {
    icon: Globe,
    title: "7. Hramba, obdelovalci in mednarodni prenosi",
    content: [
      "Podatke hranimo le toliko časa, kolikor je potrebno za namen, zaradi katerega so bili zbrani, oziroma toliko časa, kot to zahtevajo zakonodaja, varnostne potrebe ali reševanje zahtevkov in sporov.",
      "Google povezovalne podatke in druge integracijske podatke hranimo toliko časa, dokler je povezava aktivna oziroma dokler so potrebni za zagotavljanje funkcionalnosti, ki jo je uporabnik omogočil, razen če zakonodaja zahteva daljšo hrambo.",
      "Če pride do prenosa podatkov izven Evropskega gospodarskega prostora, se ta izvede le ob uporabi ustreznih zaščitnih ukrepov, na primer standardnih pogodbenih klavzul ali druge veljavne pravne podlage.",
    ],
  },
  {
    icon: Mail,
    title: "8. Vaše pravice",
    content: [
      "V skladu z veljavno zakonodajo lahko zahtevate dostop do svojih osebnih podatkov, popravek netočnih podatkov, izbris, omejitev obdelave, ugovor obdelavi ter prenosljivost podatkov, kadar so za to izpolnjeni pogoji.",
      "Če obdelava temelji na soglasju, ga lahko kadar koli prekličete za naprej. Preklic ne vpliva na zakonitost obdelave, izvedene pred preklicem.",
      "Če ste povezali Google račun, lahko dostop aplikacije prekličete tudi neposredno v nastavitvah svojega Google računa ali Google Workspace okolja. Preklic dostopa lahko vpliva na delovanje Google prijave ali ustvarjanje Google Meet terminov v aplikaciji Calendra.",
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
              Politika zasebnosti za {SITE_HOST} in Calendra aplikacijo
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Ta stran pojasnjuje, kako {LEGAL.entityName} obravnava osebne podatke obiskovalcev spletne strani in uporabnikov aplikacije Calendra, vključno z uporabo Google prijave ter Google Calendar oziroma Google Meet integracije.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="rounded-full bg-muted px-3 py-1">Zadnja posodobitev: 14. april 2026</span>
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

        <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Hitri povzetek za Google review</h2>
          <div className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
            <p>Ta politika izrecno pojasnjuje, s kom delimo, prenašamo ali razkrivamo Google uporabniške podatke: z Googlom, kadar uporabnik uporabi Google prijavo ali Google Calendar / Google Meet integracijo; z gostiteljskim oziroma infrastrukturnim ponudnikom, kadar je to potrebno za delovanje storitve; z drugimi pooblaščenimi uporabniki znotraj iste organizacije, kadar imajo dostop do zadevnih zapisov; ter z organi ali pravnimi nasledniki, kadar to zahteva zakonodaja ali poslovna transakcija.</p>
            <p>Ta politika izrecno opisuje tudi zaščitne mehanizme za občutljive podatke: HTTPS/TLS v prenosu, omejen dostop za avtenticirane uporabnike in pooblaščene osebe oziroma sisteme, ter najmanjši potreben obseg Google dovoljenj za ustvarjanje dogodkov in Google Meet povezav.</p>
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
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">9. Kontakt glede zasebnosti</h2>
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
