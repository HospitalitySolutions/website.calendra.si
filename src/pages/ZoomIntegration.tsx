import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";
import { APP_BASE_URL } from "@/lib/site";
import { LOGIN_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  AlertCircle,
  CalendarPlus2,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  Link2,
  ShieldCheck,
  Trash2,
  Video,
} from "lucide-react";

const ZOOM_MARKETPLACE_URL = "https://marketplace.zoom.us/";

const ZoomIntegration = () => {
  const { language } = useSiteLanguage();
  const isSl = language === "sl";

  const page = isSl
    ? {
        badge: "Vodnik za Zoom integracijo",
        title: "Kako povezati, uporabljati in odstraniti Zoom v Calendri",
        intro:
          "Ta stran je javna dokumentacija za uporabnike Zoom Marketplace. Pojasnjuje, kako se Zoom uporablja v aplikaciji Calendra, kako vsak svetovalec poveže svoj Zoom račun, kako se ustvarjajo Zoom povezave za spletne termine in kako odstranite avtorizacijo.",
        quickFactsTitle: "Hitri pregled",
        quickFacts: [
          {
            title: "Tip integracije",
            body: "User-level OAuth. Vsak svetovalec poveže svoj Zoom račun posebej.",
            icon: ShieldCheck,
          },
          {
            title: "Kje se uporablja",
            body: "V koledarju pri ustvarjanju ali urejanju spletnih terminov.",
            icon: CalendarPlus2,
          },
          {
            title: "Kaj Calendra naredi",
            body: "Ob shranjevanju spletnega termina ustvari Zoom srečanje v Zoom računu dodeljenega svetovalca in shrani join link v termin.",
            icon: Video,
          },
          {
            title: "Pomoč",
            body: "Če povezava ali avtorizacija ne uspe, uporabite spodnji razdelek za odpravljanje težav ali kontaktirajte podporo.",
            icon: HelpCircle,
          },
        ],
        beforeTitle: "Preden začnete",
        beforeItems: [
          "Aktiven račun v aplikaciji Calendra in dostop do koledarja na app.calendra.si.",
          "Veljaven Zoom račun za vsakega svetovalca, ki bo gostil spletne termine.",
          "Pravice za ustvarjanje ali urejanje terminov v Calendri.",
          "Če administrator ustvarja termin za drugega svetovalca, mora imeti ta svetovalec Zoom že povezan.",
        ],
        addingTitle: "1. Dodajanje aplikacije / povezava Zoom računa",
        addingLead:
          "Zoom se v Calendri poveže ob prvem poskusu ustvarjanja Zoom termina. Ločene namestitve znotraj aplikacije Calendra ni; uporabnik je preusmerjen v Zoom OAuth avtorizacijo.",
        addingSteps: [
          "Prijavite se v Calendra na app.calendra.si oziroma prek gumba Prijava na tej strani.",
          "Odprite Calendar in začnite ustvarjati nov termin ali uredite obstoječ termin.",
          "Označite, da je termin online, nato kot ponudnika srečanja izberite Zoom.",
          "Če vaš Zoom račun še ni povezan, vas Calendra samodejno preusmeri na Zoom stran za avtorizacijo.",
          "V Zoomu se prijavite in potrdite dostop aplikaciji Calendra.",
          "Po uspešni avtorizaciji ste preusmerjeni nazaj v Calendra. Sistem prikaže potrditev, da je Zoom povezan, nato lahko dokončate shranjevanje termina.",
        ],
        addingTroubleshooting: "Za pomoč pri napakah odprite razdelek za odpravljanje težav.",
        usageTitle: "2. Uporaba Zoom funkcij v aplikaciji",
        features: [
          {
            title: "Ustvarjanje Zoom termina",
            useCase: "Za individualne ali skupinske spletne termine, pri katerih mora Calendra samodejno ustvariti Zoom povezavo.",
            prerequisites: [
              "Termin mora biti označen kot online.",
              "Ponudnik srečanja mora biti nastavljen na Zoom.",
              "Dodeljeni svetovalec mora imeti povezan Zoom račun.",
            ],
            steps: [
              "V koledarju izberite čas termina in odprite obrazec za termin.",
              "Izberite stranko oziroma stranke, svetovalca in ostale podatke termina.",
              "Kot ponudnika srečanja izberite Zoom in shranite termin.",
              "Calendra ustvari Zoom srečanje v Zoom računu dodeljenega svetovalca in shrani join link v termin.",
            ],
          },
          {
            title: "Odpiranje Zoom povezave iz termina",
            useCase: "Za hiter dostop do že ustvarjenega Zoom srečanja iz koledarja ali seznama rezervacij.",
            prerequisites: [
              "Termin mora že vsebovati Zoom meeting link.",
            ],
            steps: [
              "Odprite termin v koledarju ali seznam Booked sessions.",
              "Kliknite Open Zoom, da odprete shranjeno Zoom povezavo.",
            ],
          },
          {
            title: "Urejanje obstoječega spletnega termina",
            useCase: "Ko morate pregledati ali spremeniti spletni termin, ki uporablja Zoom.",
            prerequisites: [
              "Uporabnik mora imeti pravico do urejanja termina.",
              "Če termin uporablja Zoom in potrebuje novo povezavo, mora biti Zoom račun gostitelja še vedno povezan.",
            ],
            steps: [
              "Odprite obstoječi termin v koledarju.",
              "Preverite, ali je ponudnik nastavljen na Zoom in ali je povezava prisotna.",
              "Shranite spremembe. Calendra ohrani oziroma po potrebi znova ustvari Zoom povezavo za online termin.",
            ],
          },
        ],
        troubleshootingTitle: "3. Odpravljanje težav",
        troubleshootingItems: [
          {
            title: "Zoom povezava se ne vzpostavi",
            body: "Ponovno poskusite ustvariti online termin z izbranim ponudnikom Zoom. Če avtorizacija ne uspe, preverite, ali uporabljate pravilen Zoom račun in ali ste zaključili Zoom dovoljenja do konca.",
          },
          {
            title: "Prikaže se sporočilo, da Zoom ni povezan",
            body: "To pomeni, da dodeljeni svetovalec še nima veljavne Zoom avtorizacije. Ta svetovalec se mora najprej prijaviti v Calendra in povezati Zoom ali pa administrator izbere svetovalca, ki je Zoom že povezal.",
          },
          {
            title: "Administrator ustvarja termin za drugega svetovalca",
            body: "Zoom srečanje se ustvari v Zoom računu dodeljenega svetovalca, ne administratorja. Pred shranjevanjem mora biti Zoom povezan pri uporabniku, ki bo gostitelj srečanja.",
          },
          {
            title: "Potrebujem dodatno pomoč",
            body: `Pišite na ${LEGAL.supportEmail} ali pokličite ${LEGAL.supportPhone}. V sporočilo vključite e-poštni naslov Calendra računa, e-poštni naslov Zoom računa in kratek opis korakov, kjer se težava pojavi.`,
          },
        ],
        removingTitle: "4. Odstranjevanje aplikacije / preklic avtorizacije",
        removingLead:
          "Če Zoom povezave ne želite več uporabljati, odstranite avtorizacijo v Zoom Marketplace. Calendra trenutno uporablja Zoom samo za ustvarjanje in odpiranje Zoom meeting povezav za online termine.",
        removingSteps: [
          "Prijavite se v Zoom App Marketplace.",
          "Odprite Manage in nato Added Apps oziroma poiščite aplikacijo Calendra v svojem Zoom računu.",
          "Odprite aplikacijo in izberite Remove oziroma prekličite avtorizacijo.",
          "Po odstranitvi Calendra ne more več ustvarjati novih Zoom srečanj za vaš račun, dokler povezave znova ne vzpostavite.",
        ],
        implicationsTitle: "Posledice odstranitve",
        implicationsItems: [
          "Novi online termini z izbranim ponudnikom Zoom se ne bodo mogli ustvariti, dokler Zoom znova ne povežete.",
          "Obstoječi termini v Calendri lahko še vedno vsebujejo že ustvarjene Zoom povezave, ker so te shranjene v samem terminu kot del evidenc rezervacije.",
          "Če želite po odstranitvi integracije uporabljati spletne termine brez Zooma, pri novem terminu izberite drugega ponudnika srečanja ali vnesite svojo povezavo ročno, kjer je to podprto v vašem procesu.",
        ],
        dataTitle: "Kako Calendra ravna z vašimi podatki po odstranitvi",
        dataBody1:
          "Calendra za delovanje Zoom integracije hrani Zoom OAuth povezovalne podatke, vezane na vaš uporabniški račun, ter Zoom meeting link, ki je shranjen pri posameznem online terminu. Dokumentacija je pripravljena glede na trenutno implementacijo aplikacije.",
        dataBody2:
          `Če želite odstranitev shranjenih Zoom povezovalnih podatkov iz Calendre, po odstranitvi avtorizacije kontaktirajte podporo na ${LEGAL.supportEmail}. V zahtevi navedite e-poštni naslov računa in zahtevo za odstranitev Zoom connection data.`,
        dataBody3:
          "Če želite odstraniti tudi obstoječe Zoom povezave iz zgodovine terminov, je treba ustrezne termine urediti ali izbrisati v Calendri.",
        supportCta: "Kontaktirajte podporo",
        loginCta: "Odpri Calendra prijavo",
        marketplaceCta: "Odpri Zoom Marketplace",
        supportTitle: "Povezave",
        faqTitle: "Kratek povzetek za Zoom review",
        faqItems: [
          "Dodajanje: uporabnik poveže Zoom ob prvem ustvarjanju Zoom termina v koledarju Calendra.",
          "Uporaba: Calendra ustvari Zoom meeting v računu povezanega svetovalca in shrani povezavo v termin.",
          "Odstranitev: uporabnik odstrani aplikacijo v Zoom Marketplace; za odstranitev shranjenih povezovalnih podatkov v Calendri kontaktira podporo.",
        ],
      }
    : {
        badge: "Zoom integration guide",
        title: "How to connect, use, and remove Zoom in Calendra",
        intro:
          "This public guide is intended for Zoom Marketplace users and reviewers. It explains how Zoom works in Calendra, how each consultant connects their own Zoom account, how Zoom meeting links are created for online sessions, and how to remove authorization.",
        quickFactsTitle: "Quick facts",
        quickFacts: [
          {
            title: "Integration type",
            body: "User-level OAuth. Each consultant connects their own Zoom account separately.",
            icon: ShieldCheck,
          },
          {
            title: "Where it is used",
            body: "Inside the calendar when creating or editing online sessions.",
            icon: CalendarPlus2,
          },
          {
            title: "What Calendra does",
            body: "When an online session is saved, Calendra creates a Zoom meeting in the assigned consultant's Zoom account and stores the join link on the booking.",
            icon: Video,
          },
          {
            title: "Help",
            body: "If connection or authorization fails, use the troubleshooting section below or contact support.",
            icon: HelpCircle,
          },
        ],
        beforeTitle: "Before you start",
        beforeItems: [
          "An active Calendra account and access to the calendar in app.calendra.si.",
          "A valid Zoom account for each consultant who will host online sessions.",
          "Permission to create or edit sessions in Calendra.",
          "If an admin books on behalf of another consultant, that consultant must already have Zoom connected.",
        ],
        addingTitle: "1. Adding the app / connecting your Zoom account",
        addingLead:
          "In Calendra, Zoom is connected the first time a user tries to create a Zoom-based online session. There is no separate in-app installation screen inside Calendra; the user is redirected into Zoom OAuth authorization.",
        addingSteps: [
          "Sign in to Calendra at app.calendra.si, or use the Login button on this website.",
          "Open Calendar and start creating a new session or edit an existing one.",
          "Mark the session as online and choose Zoom as the meeting provider.",
          "If your Zoom account is not connected yet, Calendra automatically redirects you to Zoom's authorization page.",
          "Sign in to Zoom and approve access for Calendra.",
          "After successful authorization, you are redirected back to Calendra. The app shows a Zoom connected confirmation and you can finish saving the session.",
        ],
        addingTroubleshooting: "For help with errors, open the troubleshooting guide below.",
        usageTitle: "2. Using Zoom features in the app",
        features: [
          {
            title: "Create a Zoom session",
            useCase: "Use this when you want Calendra to automatically create a Zoom meeting for a one-on-one or multi-client online session.",
            prerequisites: [
              "The session must be marked as online.",
              "The meeting provider must be set to Zoom.",
              "The assigned consultant must have a connected Zoom account.",
            ],
            steps: [
              "Choose a time slot in the calendar and open the session form.",
              "Select the client or clients, consultant, and other session details.",
              "Choose Zoom as the meeting provider and save the session.",
              "Calendra creates a Zoom meeting in the assigned consultant's Zoom account and stores the join link on the booking.",
            ],
          },
          {
            title: "Open the Zoom link from a booking",
            useCase: "Use this for fast access to an already created Zoom meeting from the calendar or booked sessions list.",
            prerequisites: [
              "The booking must already contain a Zoom meeting link.",
            ],
            steps: [
              "Open the booking in the calendar or in the Booked sessions list.",
              "Click Open Zoom to open the stored Zoom link.",
            ],
          },
          {
            title: "Edit an existing online session",
            useCase: "Use this when you need to review or update an online session that uses Zoom.",
            prerequisites: [
              "The user must have permission to edit the booking.",
              "If the session needs a fresh Zoom link, the host consultant's Zoom account must still be connected.",
            ],
            steps: [
              "Open the existing booking in the calendar.",
              "Check that Zoom is still selected as the meeting provider and that the link is present.",
              "Save your changes. Calendra keeps or recreates the Zoom link for the online session as needed.",
            ],
          },
        ],
        troubleshootingTitle: "3. Troubleshooting guide",
        troubleshootingItems: [
          {
            title: "The Zoom connection does not complete",
            body: "Try creating the online session again with Zoom selected as the provider. If authorization fails, make sure you are signing in with the correct Zoom account and that you complete the Zoom approval flow all the way through.",
          },
          {
            title: "Calendra says Zoom is still not connected",
            body: "This means the assigned consultant does not currently have a valid Zoom authorization. That consultant should sign in to Calendra and connect Zoom first, or the admin should assign a consultant who already connected Zoom.",
          },
          {
            title: "An admin is booking for another consultant",
            body: "The Zoom meeting is created in the assigned consultant's Zoom account, not the admin's account. The consultant who will host the meeting must connect Zoom before the booking is saved.",
          },
          {
            title: "I need more help",
            body: `Email ${LEGAL.supportEmail} or call ${LEGAL.supportPhone}. Include your Calendra account email, the Zoom account email, and a short description of the step where the issue occurs.`,
          },
        ],
        removingTitle: "4. Removing the app / revoking authorization",
        removingLead:
          "If you no longer want to use Zoom with Calendra, remove the authorization in Zoom App Marketplace. Calendra currently uses Zoom only to create and open Zoom meeting links for online sessions.",
        removingSteps: [
          "Sign in to Zoom App Marketplace.",
          "Open Manage and then Added Apps, or locate Calendra in your Zoom account.",
          "Open the app and choose Remove to revoke authorization.",
          "After removal, Calendra can no longer create new Zoom meetings for your account until you connect Zoom again.",
        ],
        implicationsTitle: "What happens after removal",
        implicationsItems: [
          "New online sessions that use Zoom cannot be created until Zoom is connected again.",
          "Existing bookings in Calendra may still contain previously generated Zoom meeting links, because those links are stored on the booking record itself.",
          "If you still need online sessions after removing Zoom, choose another meeting provider for new bookings or use your own manual process where applicable.",
        ],
        dataTitle: "How Calendra handles your data after removal",
        dataBody1:
          "To make the Zoom integration work, Calendra stores Zoom OAuth connection data linked to your user account and stores the generated Zoom meeting link on each related online booking. This documentation reflects the current implementation of the uploaded app.",
        dataBody2:
          `If you want the stored Zoom connection data removed from Calendra after revoking authorization, contact support at ${LEGAL.supportEmail} and include the email address of the affected account with a request to remove Zoom connection data.`,
        dataBody3:
          "If you also want previously stored Zoom meeting links removed from booking history, the related bookings must be updated or deleted in Calendra.",
        supportCta: "Contact support",
        loginCta: "Open Calendra login",
        marketplaceCta: "Open Zoom Marketplace",
        supportTitle: "Useful links",
        faqTitle: "Reviewer summary",
        faqItems: [
          "Adding: a user connects Zoom the first time they create a Zoom-based session in Calendra's calendar.",
          "Usage: Calendra creates the Zoom meeting in the connected consultant's account and stores the link on the booking.",
          "Removing: the user removes the app in Zoom Marketplace; for removal of stored connection data in Calendra, they contact support.",
        ],
      };

  const mailtoHref = `mailto:${LEGAL.supportEmail}?subject=${encodeURIComponent(
    isSl ? "Calendra Zoom integracija" : "Calendra Zoom integration"
  )}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4 lg:px-8">
          <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
            <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              {page.badge}
            </span>
            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {page.title}
            </h1>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-muted-foreground">{page.intro}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="font-semibold">
                <a href={LOGIN_ROUTE}>{page.loginCta}</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-semibold">
                <a href={ZOOM_MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                  {page.marketplaceCta}
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="font-semibold">
                <a href="#troubleshooting">{isSl ? "Odpri odpravljanje težav" : "Open troubleshooting"}</a>
              </Button>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-4 font-display text-2xl font-bold tracking-tight text-foreground">{page.quickFactsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {page.quickFacts.map((fact) => {
                const Icon = fact.icon;
                return (
                  <div key={fact.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-foreground">{fact.title}</h3>
                    <p className="mt-2 text-base leading-7 text-muted-foreground">{fact.body}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.beforeTitle}</h2>
            <ul className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
              {page.beforeItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.addingTitle}</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{page.addingLead}</p>
            <ol className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.addingSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm font-medium text-primary">
              <a href="#troubleshooting" className="inline-flex items-center gap-2 hover:underline">
                <HelpCircle className="h-4 w-4" />
                {page.addingTroubleshooting}
              </a>
            </p>
          </section>

          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.usageTitle}</h2>
            <div className="mt-6 space-y-6">
              {page.features.map((feature) => (
                <div key={feature.title} className="rounded-2xl border border-border/60 bg-background/40 p-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                      <p className="mt-2 text-base leading-7 text-muted-foreground">
                        <strong className="text-foreground">{isSl ? "Primer uporabe:" : "Use case:"}</strong> {feature.useCase}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-6 lg:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                        {isSl ? "Predpogoji" : "Prerequisites"}
                      </h4>
                      <ul className="mt-3 space-y-2 text-base leading-7 text-muted-foreground">
                        {feature.prerequisites.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
                        {isSl ? "Koraki" : "Steps"}
                      </h4>
                      <ol className="mt-3 space-y-2 text-base leading-7 text-muted-foreground">
                        {feature.steps.map((step, index) => (
                          <li key={step} className="flex gap-3">
                            <span className="min-w-6 font-semibold text-primary">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="troubleshooting" className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.troubleshootingTitle}</h2>
            <div className="mt-6 space-y-4">
              {page.troubleshootingItems.map((item) => (
                <div key={item.title} className="rounded-2xl border border-border/60 bg-background/40 p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-base leading-7 text-muted-foreground">{item.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.removingTitle}</h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">{page.removingLead}</p>
            <ol className="mt-6 space-y-4 text-base leading-7 text-muted-foreground">
              {page.removingSteps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/40 p-6">
                <div className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{page.implicationsTitle}</h3>
                </div>
                <ul className="mt-4 space-y-3 text-base leading-7 text-muted-foreground">
                  {page.implicationsItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/40 p-6">
                <div className="flex items-center gap-3">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">{page.dataTitle}</h3>
                </div>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{page.dataBody1}</p>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{page.dataBody2}</p>
                <p className="mt-4 text-base leading-7 text-muted-foreground">{page.dataBody3}</p>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.supportTitle}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="font-semibold">
                  <a href={mailtoHref}>{page.supportCta}</a>
                </Button>
                <Button asChild variant="outline" className="font-semibold">
                  <a href={LOGIN_ROUTE}>{page.loginCta}</a>
                </Button>
                <Button asChild variant="outline" className="font-semibold">
                  <a href={ZOOM_MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">
                    {page.marketplaceCta}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                {isSl ? "Calendra prijava:" : "Calendra login:"} <a className="font-medium text-primary underline underline-offset-4" href={LOGIN_ROUTE}>{APP_BASE_URL.replace(/^https?:\/\//, "")}/login</a>
              </p>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{page.faqTitle}</h2>
              <ul className="mt-5 space-y-3 text-base leading-7 text-muted-foreground">
                {page.faqItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ZoomIntegration;
