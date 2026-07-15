import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { getItServiceContent, IT_SERVICE_ROUTE_KEYS } from "@/lib/it-services";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CloudCog,
  Code2,
  Globe2,
  Headphones,
  Mail,
  Repeat2,
  ShieldCheck,
  Wrench,
} from "lucide-react";

const serviceIcons = [Headphones, Globe2, Wrench, Mail, ShieldCheck, Repeat2] as const;

const pageCopy = {
  sl: {
    badge: "IT storitve za mala podjetja",
    title: "Zanesljiva IT-podpora, spletne strani in avtomatizacije na enem mestu",
    intro:
      "Pomagamo malim podjetjem urediti vsakodnevno IT-podporo, spletne strani, poslovno e-pošto, varnostne kopije in povezovanje poslovnih sistemov. Dobite eno razumljivo kontaktno točko za tehnične naloge, ki jih ne želite prelagati med več ponudniki.",
    primaryCta: "Pošljite povpraševanje",
    secondaryCta: "Preglejte storitve",
    servicesEyebrow: "Naše storitve",
    servicesTitle: "Podpora od osnovne IT-ureditve do digitalizacije procesov",
    servicesIntro:
      "Izberete lahko posamezen projekt, pomoč po potrebi ali redno mesečno sodelovanje. Obseg vedno določimo glede na dejanske potrebe in obstoječe okolje.",
    serviceCta: "Več o storitvi",
    whyEyebrow: "Zakaj Calendra IT storitve",
    whyTitle: "Praktična pomoč brez nepotrebne zapletenosti",
    whyItems: [
      { title: "Ena kontaktna točka", body: "Povežemo naprave, spletno stran, e-pošto, varnost in poslovne sisteme v bolj urejeno celoto." },
      { title: "Jasen obseg in ponudba", body: "Pred začetkom določimo cilje, vključene naloge, odgovornosti in način obračuna." },
      { title: "Rešitve za mala podjetja", body: "Predlagamo ukrepe, ki so smiselni glede na velikost ekipe, tveganja in proračun." },
    ],
    processEyebrow: "Kako sodelujemo",
    processTitle: "Od pregleda do izvedbe v treh korakih",
    process: [
      { title: "1. Kratek uvodni pogovor", body: "Spoznamo vaše okolje, težavo, cilje in sisteme, ki jih že uporabljate." },
      { title: "2. Predlog rešitve", body: "Pripravimo jasen obseg, prioritete, časovni načrt in način sodelovanja." },
      { title: "3. Izvedba in podpora", body: "Rešitev uvedemo, dokumentiramo ter po dogovoru prevzamemo nadaljnje vzdrževanje." },
    ],
    modelsEyebrow: "Načini sodelovanja",
    modelsTitle: "Izberite model, ki ustreza vašemu podjetju",
    models: [
      { title: "Enkratni projekt", body: "Za spletno stran, migracijo e-pošte, vzpostavitev kopij, integracijo ali drugo jasno določeno nalogo." },
      { title: "Pomoč po urah", body: "Za občasne težave, manjše spremembe in naloge, pri katerih želite prilagodljiv obseg." },
      { title: "Mesečna IT-podpora", body: "Za redne preglede, vzdrževanje, administracijo uporabnikov in dogovorjeno odzivnost." },
    ],
    faqEyebrow: "Pogosta vprašanja",
    faqTitle: "Pred začetkom sodelovanja",
    faq: [
      { q: "Ali delate samo z uporabniki Calendre?", a: "Ne. IT storitve so samostojna ponudba za mala podjetja in niso vezane na uporabo aplikacije Calendra." },
      { q: "Ali je možna pomoč na daljavo?", a: "Da. Velik del podpore, nastavitev in diagnostike izvedemo oddaljeno. Obiske na lokaciji dogovorimo glede na kraj in obseg dela." },
      { q: "Kako določite ceno?", a: "Po kratkem uvodnem pogovoru predlagamo projektno ceno, urno sodelovanje ali mesečni obseg podpore. IT storitve niso vključene v naročnino Calendra." },
      { q: "Ali lahko prevzamete obstoječo spletno stran ali IT-okolje?", a: "Da, po začetnem tehničnem pregledu, s katerim ugotovimo stanje, odprta tveganja in realen obseg prevzema." },
    ],
    finalTitle: "Potrebujete zanesljivo pomoč pri IT-ju ali spletni strani?",
    finalBody: "Opišite trenutno stanje in cilj. Predlagali bomo naslednji smiseln korak brez obveznosti.",
    finalCta: "Pogovorimo se o vaših potrebah",
  },
  en: {
    badge: "IT services for small businesses",
    title: "Reliable IT support, websites and automation in one place",
    intro:
      "We help small businesses organise everyday IT support, websites, business email, backups and system integration. You get one clear contact for technical work that would otherwise be split between several suppliers.",
    primaryCta: "Send an enquiry",
    secondaryCta: "Explore services",
    servicesEyebrow: "Our services",
    servicesTitle: "Support from essential IT setup to process digitalisation",
    servicesIntro:
      "Choose a defined project, ad-hoc help or regular monthly cooperation. The scope is always based on your actual needs and current environment.",
    serviceCta: "Explore the service",
    whyEyebrow: "Why Calendra IT services",
    whyTitle: "Practical help without unnecessary complexity",
    whyItems: [
      { title: "One point of contact", body: "We connect devices, websites, email, security and business systems into a more organised whole." },
      { title: "Clear scope and proposal", body: "Before work starts, we define objectives, included tasks, responsibilities and the billing model." },
      { title: "Designed for small businesses", body: "We recommend controls and solutions appropriate to your team size, risks and budget." },
    ],
    processEyebrow: "How we work",
    processTitle: "From review to delivery in three steps",
    process: [
      { title: "1. Introductory discussion", body: "We learn about your environment, problem, goals and existing systems." },
      { title: "2. Proposed solution", body: "We prepare a clear scope, priorities, schedule and cooperation model." },
      { title: "3. Delivery and support", body: "We implement and document the solution and can provide ongoing maintenance when agreed." },
    ],
    modelsEyebrow: "Ways to work together",
    modelsTitle: "Choose a model that fits your business",
    models: [
      { title: "One-off project", body: "For a website, email migration, backup setup, integration or another clearly defined task." },
      { title: "Hourly support", body: "For occasional issues, smaller changes and work where you need a flexible scope." },
      { title: "Monthly IT support", body: "For regular checks, maintenance, user administration and agreed response arrangements." },
    ],
    faqEyebrow: "Frequently asked questions",
    faqTitle: "Before we start",
    faq: [
      { q: "Do you work only with Calendra customers?", a: "No. IT services are a standalone offer for small businesses and do not require use of the Calendra application." },
      { q: "Can support be remote?", a: "Yes. A large share of support, configuration and diagnosis can be completed remotely. On-site work is agreed based on location and scope." },
      { q: "How is pricing determined?", a: "After a short discussion, we propose a project price, hourly work or a monthly support scope. IT services are not included in a Calendra subscription." },
      { q: "Can you take over an existing website or IT environment?", a: "Yes, following an initial technical review of its condition, open risks and the realistic takeover scope." },
    ],
    finalTitle: "Do you need reliable help with IT or your website?",
    finalBody: "Describe the current situation and your goal. We will suggest a sensible next step without obligation.",
    finalCta: "Discuss your requirements",
  },
} as const;

const ItServicesPage = () => {
  const { language } = useSiteLanguage();
  const copy = pageCopy[language];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.07] py-20 md:py-28">
          <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-primary/[0.09] blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="max-w-4xl">
                <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.07] px-4 py-2 text-sm font-semibold text-primary">{copy.badge}</span>
                <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">{copy.title}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{copy.intro}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" className="rounded-xl" asChild>
                    <a href={getRoutePath("contact", language)}>{copy.primaryCta}<ArrowRight className="h-4 w-4" /></a>
                  </Button>
                  <Button variant="outline" size="lg" className="rounded-xl" asChild>
                    <a href="#it-storitve-seznam">{copy.secondaryCta}</a>
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-3xl border border-border/60 bg-background/90 p-6 shadow-soft backdrop-blur">
                  <BriefcaseBusiness className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p className="mt-5 text-lg font-bold text-foreground">{language === "sl" ? "Za mala podjetja brez lastnega IT-oddelka" : "For small businesses without an internal IT department"}</p>
                  <p className="mt-2 leading-7 text-muted-foreground">{language === "sl" ? "Razumljiva tehnična pomoč, jasen obseg in ena odgovorna kontaktna oseba." : "Clear technical help, a defined scope and one accountable point of contact."}</p>
                </div>
                <div className="rounded-3xl border border-border/60 bg-background/90 p-6 shadow-soft backdrop-blur">
                  <BadgeCheck className="h-8 w-8 text-primary" aria-hidden="true" />
                  <p className="mt-5 text-lg font-bold text-foreground">{language === "sl" ? "Ločeno od naročnine Calendra" : "Separate from the Calendra subscription"}</p>
                  <p className="mt-2 leading-7 text-muted-foreground">{language === "sl" ? "IT storitve se naročijo posebej glede na obseg, projekt ali dogovorjeno mesečno podporo." : "IT services are ordered separately based on scope, project requirements or monthly support."}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="it-storitve-seznam" className="scroll-mt-24 bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.servicesEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.servicesTitle}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{copy.servicesIntro}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {IT_SERVICE_ROUTE_KEYS.map((routeKey, index) => {
                const service = getItServiceContent(routeKey, language);
                const Icon = serviceIcons[index];
                return (
                  <article key={routeKey} className="flex flex-col rounded-3xl border border-border/60 bg-background p-7 shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                    <h3 className="mt-6 text-xl font-bold text-foreground">{service.title}</h3>
                    <p className="mt-3 flex-1 leading-7 text-muted-foreground">{service.shortDescription}</p>
                    <a href={getRoutePath(routeKey, language)} className="mt-6 inline-flex items-center gap-2 font-semibold text-primary transition hover:gap-3">
                      {copy.serviceCta}<ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.whyEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.whyTitle}</h2>
            </div>
            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {[CloudCog, CheckCircle2, Code2].map((Icon, index) => (
                <article key={copy.whyItems[index].title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                  <Icon className="h-7 w-7 text-primary" aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-bold text-foreground">{copy.whyItems[index].title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{copy.whyItems[index].body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.processEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.processTitle}</h2>
                <div className="mt-8 grid gap-4">
                  {copy.process.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-border/60 bg-background p-6">
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.modelsEyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.modelsTitle}</h2>
                <div className="mt-8 grid gap-4">
                  {copy.models.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-primary/15 bg-primary/[0.04] p-6">
                      <h3 className="font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.faqEyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.faqTitle}</h2>
            </div>
            <div className="grid gap-3">
              {copy.faq.map((item) => (
                <details key={item.q} className="rounded-2xl border border-border/60 bg-card p-5">
                  <summary className="cursor-pointer list-none font-semibold text-foreground">{item.q}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card pb-20 md:pb-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.09] via-background to-accent/[0.08] p-8 text-center shadow-soft md:p-12">
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.finalTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.finalBody}</p>
              <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
                <a href={getRoutePath("contact", language)}>{copy.finalCta}<ArrowRight className="h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ItServicesPage;
