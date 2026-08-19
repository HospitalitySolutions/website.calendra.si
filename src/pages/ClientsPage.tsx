import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import AnswerSummary from "@/components/seo/AnswerSummary";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import RelatedPages from "@/components/seo/RelatedPages";
import ResponsiveScreenshot from "@/components/marketing/ResponsiveScreenshot";
import { Button } from "@/components/ui/button";
import { getFaqForRoute } from "@/lib/faq";
import { getRoutePath } from "@/lib/localized-routes";
import { CUSTOMER_MARKETPLACE_PUBLIC } from "@/lib/customer-marketplace";
import { MARKETING_IMAGES } from "@/lib/marketing-images";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  CheckCircle2,
  Link2,
  MessageSquareText,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  Users,
  WalletCards,
} from "lucide-react";

const copy = {
  sl: {
    badge: "Spletno naročanje s Calendro",
    title: "Spletno naročanje strank 24 ur na dan",
    intro:
      "Stranke same izberejo storitev, zaposlenega in prost termin. Calendra preveri dejansko razpoložljivost, zapiše rezervacijo neposredno v koledar ter pošlje potrditev in opomnike brez ročnega usklajevanja.",
    heroPrimary: "Omogočite naročanje",
    heroSecondary: "Poiščite podjetje",
    screenshotAlt: "Spletno naročanje v Calendri z izbiro storitve, trajanjem in ceno",
    workflowEyebrow: "Preprost rezervacijski tok",
    workflowTitle: "Kako stranka rezervira termin",
    workflowItems: [
      { title: "Izbere storitev", description: "Prikažejo se storitve, ki jih podjetje omogoča prek spleta." },
      { title: "Izbere zaposlenega", description: "Kadar je izbira vključena, stranka izbere želenega izvajalca ali prvega prostega." },
      { title: "Izbere prost termin", description: "Calendra upošteva delovni čas, odsotnosti, druge rezervacije, prostore in pravila storitve." },
      { title: "Potrdi rezervacijo", description: "Stranka pregleda podatke, izbere plačilo in prejme potrditev." },
    ],
    capabilitiesEyebrow: "Nastavitve naročanja",
    capabilitiesTitle: "Katera pravila naročanja lahko določite?",
    capabilities: [
      { title: "Prilagodljiva izbira zaposlenega", description: "Korak izbire zaposlenega lahko vključite ali izpustite glede na storitev in način dela." },
      { title: "Predplačilo, celotno plačilo ali plačilo na lokaciji", description: "Za vsako ponudbo določite podprte načine plačila in višino zahtevanega predplačila." },
      { title: "Potrditev, sprememba in odpoved", description: "Stranka prejme jasne informacije ter lahko prek varne povezave spremeni ali odpove termin." },
      { title: "SMS in e-poštni opomniki", description: "Avtomatska obvestila zmanjšajo pozabljene termine in količino ročnega usklajevanja." },
      { title: "Vtičnik ali javna povezava", description: "Naročanje vgradite na svojo spletno stran ali delite samostojno javno povezavo." },
      { title: "Takojšen zapis v koledar", description: "Potrjena rezervacija se brez prepisovanja pojavi v Calendri in pri izbranem zaposlenem." },
    ],
    visualEyebrow: "Rezervacijska izkušnja",
    visualTitle: "Stranka vidi samo jasne naslednje korake",
    visualIntro: "Javna stran za naročanje vodi stranko od izbire prostega termina do pregleda rezervacije brez telefonskega usklajevanja.",
    timeTitle: "Prosti termini in kapaciteta v realnem času",
    timeBody: "Pri skupinskih storitvah stranka vidi odprte ure in število prostih mest. Pri individualnih storitvah se pokažejo samo termini, ki so dejansko na voljo.",
    reviewTitle: "Pregled rezervacije in način plačila",
    reviewBody: "Pred potrditvijo stranka pregleda storitev, datum, uro in plačilo. Podjetje samo določi, ali je plačilo na lokaciji, predplačilo ali spletno plačilo del rezervacijskega toka.",
    trustedEyebrow: "Uporabljajo Calendro",
    trustedTitle: "Od psihološkega svetovanja do lepotnih storitev",
    directoryEyebrow: "Želite rezervirati termin?",
    directoryTitle: "Poiščite podjetje, ki uporablja Calendro",
    directoryBody:
      "Javni imenik je zdaj ločen od predstavitve funkcionalnosti. Tako lahko hitro poiščete ponudnika, pregledate njegov profil in odprete njegovo neposredno rezervacijsko povezavo.",
    directoryButton: "Odprite imenik podjetij",
    faqEyebrow: "Pogosta vprašanja",
    faqTitle: "Spletno naročanje brez tehničnih zapletov",
    ctaEyebrow: "Za storitvena podjetja",
    ctaTitle: "Omogočite naročanje 24 ur na dan",
    ctaDescription: "Začnite s 14-dnevnim brezplačnim preizkusom in nastavite svoj rezervacijski tok brez kreditne kartice.",
    ctaButton: "Preizkusite brezplačno",
  },
  en: {
    badge: "Online booking with Calendra",
    title: "Accept customer bookings 24 hours a day",
    intro:
      "Customers choose a service, employee and available time themselves. Calendra checks real availability, writes the booking directly to the calendar and sends confirmations and reminders without manual coordination.",
    heroPrimary: "Enable online booking",
    heroSecondary: "Find a business",
    screenshotAlt: "Calendra online booking with service selection, duration and price",
    workflowEyebrow: "A simple booking flow",
    workflowTitle: "How a customer books",
    workflowItems: [
      { title: "Choose a service", description: "The customer sees services that the business has made available online." },
      { title: "Choose an employee", description: "When enabled, the customer selects a preferred provider or the first available person." },
      { title: "Choose an available time", description: "Calendra considers working hours, absences, other bookings, resources and service rules." },
      { title: "Confirm the booking", description: "The customer reviews the details, selects payment and receives confirmation." },
    ],
    capabilitiesEyebrow: "Booking settings",
    capabilitiesTitle: "Which booking rules can you define?",
    capabilities: [
      { title: "Flexible employee selection", description: "The employee step can be enabled or skipped based on the service and workflow." },
      { title: "Deposit, full payment or pay on site", description: "Choose supported payment methods and the required deposit for each offer." },
      { title: "Confirmation, rescheduling and cancellation", description: "Customers receive clear information and can use secure links to change or cancel." },
      { title: "SMS and email reminders", description: "Automatic notifications reduce missed appointments and manual coordination." },
      { title: "Website widget or public link", description: "Embed booking on your website or share a standalone public booking link." },
      { title: "Immediate calendar entry", description: "A confirmed booking appears in Calendra and for the selected employee without re-entering data." },
    ],
    visualEyebrow: "Booking experience",
    visualTitle: "Customers always see a clear next step",
    visualIntro: "The public booking page guides customers from available time selection to the final booking review without phone coordination.",
    timeTitle: "Real-time availability and group capacity",
    timeBody: "For group services, customers see open class times and remaining places. For one-to-one services, only genuinely available appointments are offered.",
    reviewTitle: "Booking review and payment method",
    reviewBody: "Before confirming, customers review the service, date, time and payment. The business decides whether the flow uses pay on site, a deposit or online payment.",
    trustedEyebrow: "Businesses using Calendra",
    trustedTitle: "From psychological counselling to beauty services",
    directoryEyebrow: "Looking to book an appointment?",
    directoryTitle: "Find a business that uses Calendra",
    directoryBody:
      "The public business directory is now separate from the product page. Search for a provider, review its public profile and open its direct booking link without mixing customer discovery with Calendra product information.",
    directoryButton: "Open the business directory",
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Online booking without technical friction",
    ctaEyebrow: "For service businesses",
    ctaTitle: "Accept bookings 24 hours a day",
    ctaDescription: "Start a 14-day free trial and configure your booking flow without a credit card.",
    ctaButton: "Try it free",
  },
} as const;

const capabilityIcons = [UserRoundCheck, WalletCards, MessageSquareText, BellRing, MonitorSmartphone, CalendarDays] as const;
const workflowIcons = [Sparkles, Users, CalendarDays, ShieldCheck] as const;

const ClientsPage = () => {
  const { language } = useSiteLanguage();
  const text = copy[language];
  const customerSearchPath = getRoutePath("customers", language);

  return (
    <div className="marketing-page min-h-screen overflow-hidden bg-background">
      <Navbar />
      <main>
        <section className="relative border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.05] py-16 md:py-24">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/[0.08] blur-3xl" aria-hidden="true" />
          <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-primary/[0.10] blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
            <div>
              <PageBreadcrumbs routeKey="booking" />
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-4 w-4" />{text.badge}</div>
              <h1 className="mt-7 font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">{text.title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">{text.intro}</p>
              <AnswerSummary routeKey="booking" className="mt-6" />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{text.heroPrimary}<ArrowRight className="h-4 w-4" /></a></Button>
                {CUSTOMER_MARKETPLACE_PUBLIC && (
                  <Button variant="outline" size="lg" className="rounded-xl" asChild><a href={customerSearchPath}>{text.heroSecondary}</a></Button>
                )}
              </div>
            </div>
            <div className="relative rounded-[1.75rem] border border-white/80 bg-white/75 p-3 shadow-[0_30px_80px_-35px_hsl(var(--primary)/0.45)]">
              <img
                src={MARKETING_IMAGES.bookingService.src}
                srcSet={MARKETING_IMAGES.bookingService.srcSet}
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt={text.screenshotAlt}
                width={MARKETING_IMAGES.bookingService.width}
                height={MARKETING_IMAGES.bookingService.height}
                loading="eager"
                decoding="async"
                className="w-full rounded-[1.3rem] border border-border/60"
              />
              <div className="absolute -bottom-6 left-6 hidden rounded-2xl border border-border/60 bg-card p-4 shadow-soft sm:flex sm:items-center sm:gap-3"><CheckCircle2 className="h-6 w-6 text-primary" /><span className="text-sm font-semibold text-foreground">{language === "sl" ? "Rezervacija se takoj zapiše v koledar" : "The booking is added to the calendar immediately"}</span></div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-20 lg:px-8 md:py-28">
          <div className="mx-auto max-w-3xl text-center"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.workflowEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.workflowTitle}</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{text.workflowItems.map((item, index) => { const Icon = workflowIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-5 w-5" /></span><p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-primary">{language === "sl" ? "Korak" : "Step"} {index + 1}</p><h3 className="mt-2 text-lg font-bold text-foreground">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p></article>; })}</div>
        </section>

        <section className="border-y border-border/50 bg-background py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.visualEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.visualTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{text.visualIntro}</p>
            </div>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <div>
                <ResponsiveScreenshot
                  image={MARKETING_IMAGES.bookingTime}
                  alt={language === "sl" ? "Spletno naročanje v Calendri z izbiro datuma, odprtimi skupinskimi termini in prikazom prostih mest" : "Calendra online booking with date selection, open group times and remaining places"}
                  caption={language === "sl" ? "Stranka izbere datum in vidi samo odprte termine z aktualnim številom prostih mest." : "Customers select a date and see only open times with the current number of available places."}
                />
                <h3 className="mt-5 text-xl font-bold text-foreground">{text.timeTitle}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text.timeBody}</p>
              </div>
              <div>
                <ResponsiveScreenshot
                  image={MARKETING_IMAGES.bookingReview}
                  alt={language === "sl" ? "Pregled spletne rezervacije v Calendri z vnosom podatkov, načinom plačila in povzetkom termina" : "Calendra booking review with customer details, payment method and appointment summary"}
                  caption={language === "sl" ? "Pred potrditvijo so storitev, datum, ura in način plačila jasno prikazani na enem mestu." : "Before confirmation, the service, date, time and payment method are clearly shown in one place."}
                />
                <h3 className="mt-5 text-xl font-bold text-foreground">{text.reviewTitle}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text.reviewBody}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-3xl"><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.capabilitiesEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.capabilitiesTitle}</h2></div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{text.capabilities.map((item, index) => { const Icon = capabilityIcons[index]; return <article key={item.title} className="rounded-3xl border border-border/60 bg-background p-7"><Icon className="h-7 w-7 text-primary" /><h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{item.description}</p></article>; })}</div>
          </div>
        </section>

        <section className="bg-background py-14">
          <div className="container mx-auto max-w-7xl px-4 lg:px-8">
            <div className="rounded-[2rem] border border-primary/15 bg-primary/[0.035] p-7 md:p-9">
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.trustedEyebrow}</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-foreground md:text-3xl">{text.trustedTitle}</h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href="https://avisensa.com/" target="_blank" rel="noreferrer noopener" className="rounded-2xl border border-border/70 bg-card px-5 py-4 font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:text-primary">Inštitut Avisensa</a>
                <a href="https://www.depilacijeug.si/" target="_blank" rel="noreferrer noopener" className="rounded-2xl border border-border/70 bg-card px-5 py-4 font-semibold text-foreground shadow-sm transition hover:border-primary/30 hover:text-primary">Depilacije UG</a>
              </div>
            </div>
          </div>
        </section>

        {CUSTOMER_MARKETPLACE_PUBLIC && (
          <section className="container mx-auto max-w-7xl px-4 py-16 lg:px-8 md:py-20">
            <div className="grid gap-6 rounded-[2rem] border border-border/70 bg-card p-8 shadow-soft md:grid-cols-[1fr_auto] md:items-center md:p-10">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.directoryEyebrow}</p>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground">{text.directoryTitle}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{text.directoryBody}</p>
              </div>
              <Button variant="outline" size="lg" className="rounded-xl" asChild><a href={customerSearchPath}><Search className="h-4 w-4" />{text.directoryButton}</a></Button>
            </div>
          </section>
        )}

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8"><div><span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{text.faqEyebrow}</span><h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{text.faqTitle}</h2><Link2 className="mt-7 h-9 w-9 text-primary" /></div><div className="grid gap-3">{(getFaqForRoute("booking", language) ?? []).map((item) => <details key={item.question} className="rounded-2xl border border-border/60 bg-background p-5"><summary className="cursor-pointer list-none font-semibold text-foreground"><h3 className="inline text-base font-semibold">{item.question}</h3></summary><p className="mt-3 leading-7 text-muted-foreground">{item.answer}</p></details>)}</div></div>
        </section>

        <RelatedPages routeKey="booking" />

        <section className="container mx-auto max-w-7xl px-4 py-16 lg:px-8 md:py-24">
          <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/[0.10] via-card to-accent/[0.08] p-8 shadow-soft md:p-12"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.ctaEyebrow}</p><h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.ctaTitle}</h2><p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{text.ctaDescription}</p></div><Button variant="hero" size="lg" className="rounded-xl" asChild><a href={TRIAL_SIGNUP_ROUTE}>{text.ctaButton}<ArrowRight className="h-4 w-4" /></a></Button></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ClientsPage;
