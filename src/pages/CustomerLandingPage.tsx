import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import AnswerSummary from "@/components/seo/AnswerSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CUSTOMER_LOGIN_ROUTE, CUSTOMER_REGISTER_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, CalendarCheck2, MapPin, Search, Sparkles, UserRoundCheck, WalletCards } from "lucide-react";

const CustomerLandingPage = () => {
  const { language } = useSiteLanguage();
  const providersPath = getRoutePath("businesses", language);
  const connectPath = getRoutePath("connect", language);

  const text = language === "sl" ? {
    badge: "Calendra za stranke",
    title: "Poiščite ponudnika in rezervirajte termin",
    intro: "Poiščite storitev ali ponudnika, izberite lokacijo in nadaljujte neposredno do prostega termina. Brez klicev in usklajevanja po sporočilih.",
    what: "Kaj iščete?",
    whatPlaceholder: "Masaža, frizer, svetovanje …",
    where: "Kje?",
    wherePlaceholder: "Maribor, Ljubljana …",
    search: "Poišči",
    popular: "Priljubljene kategorije",
    categories: [
      ["Salon", "salon"],
      ["Fitnes", "fitness"],
      ["Wellness", "wellness"],
      ["Zdravje", "health"],
      ["Svetovanje", "consulting"],
    ],
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Vaši termini in ugodnosti na enem mestu",
    benefits: [
      ["Vsi termini na enem mestu", "Preglejte prihodnje in pretekle rezervacije pri različnih ponudnikih.", CalendarCheck2],
      ["Paketi, članstva in boni", "V denarnici spremljajte kupljene pakete, članstva, bone in preostalo dobroimetje.", WalletCards],
      ["Hitrejše ponovno naročanje", "Ko se vrnete k ponudniku, je naslednja rezervacija hitrejša in preglednejša.", UserRoundCheck],
    ] as const,
    connectCta: "Spoznajte Calendra Connect",
    login: "Prijava za stranke",
    register: "Ustvari brezplačen račun",
    businessEyebrow: "Ste ponudnik storitev?",
    businessTitle: "Calendra pomaga tudi pri upravljanju vašega poslovanja.",
    businessCta: "Calendra za podjetja",
  } : {
    badge: "Calendra for customers",
    title: "Find a provider and book an appointment",
    intro: "Search for a service or provider, choose a location and continue directly to an available appointment. No calls or back-and-forth messages.",
    what: "What are you looking for?",
    whatPlaceholder: "Massage, hairdresser, counselling …",
    where: "Where?",
    wherePlaceholder: "Maribor, Ljubljana …",
    search: "Search",
    popular: "Popular categories",
    categories: [
      ["Salon", "salon"],
      ["Fitness", "fitness"],
      ["Wellness", "wellness"],
      ["Health", "health"],
      ["Consulting", "consulting"],
    ],
    benefitsEyebrow: "Calendra Connect",
    benefitsTitle: "Your appointments and benefits in one place",
    benefits: [
      ["All appointments in one place", "See upcoming and past bookings across different providers.", CalendarCheck2],
      ["Packages, memberships and gift cards", "Keep purchased packages, memberships, gift cards and remaining balances in your wallet.", WalletCards],
      ["Faster repeat booking", "When you return to a provider, your next booking is faster and easier to manage.", UserRoundCheck],
    ] as const,
    connectCta: "Explore Calendra Connect",
    login: "Customer login",
    register: "Create a free account",
    businessEyebrow: "Are you a service provider?",
    businessTitle: "Calendra also helps you run your business.",
    businessCta: "Calendra for business",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border/50 bg-gradient-to-br from-background via-card to-primary/[0.07] py-16 md:py-24">
          <div className="container mx-auto max-w-6xl px-4 text-center lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/[0.09] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-4 w-4" />{text.badge}
            </div>
            <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-6xl">{text.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">{text.intro}</p>
            <AnswerSummary routeKey="customers" className="mx-auto mt-6 max-w-3xl text-left" />

            <form action={providersPath} method="get" className="mx-auto mt-9 grid max-w-4xl gap-3 rounded-[1.75rem] border border-border/70 bg-card p-4 text-left shadow-soft md:grid-cols-[1fr_0.8fr_auto] md:items-end md:p-5">
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.what}</span>
                <span className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input name="q" placeholder={text.whatPlaceholder} className="h-14 rounded-2xl bg-background pl-12 text-base" />
                </span>
              </label>
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.where}</span>
                <span className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input name="location" placeholder={text.wherePlaceholder} className="h-14 rounded-2xl bg-background pl-12 text-base" />
                </span>
              </label>
              <Button type="submit" variant="hero" size="lg" className="h-14 rounded-2xl px-7">{text.search}<ArrowRight className="h-4 w-4" /></Button>
            </form>

            <div className="mt-7">
              <p className="text-sm font-semibold text-muted-foreground">{text.popular}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {text.categories.map(([label, category]) => (
                  <a key={category} href={`${providersPath}?category=${category}#kategorije`} className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.benefitsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.benefitsTitle}</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {text.benefits.map(([title, body, Icon]) => (
              <article key={title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.08] text-primary"><Icon className="h-6 w-6" /></span>
                <h3 className="mt-5 text-xl font-bold text-foreground">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" className="rounded-xl" asChild><a href={connectPath}>{text.connectCta}<ArrowRight className="h-4 w-4" /></a></Button>
            <Button variant="outline" size="lg" className="rounded-xl" asChild><a href={CUSTOMER_LOGIN_ROUTE}>{text.login}</a></Button>
          </div>
          <p className="mt-4 text-center"><a href={CUSTOMER_REGISTER_ROUTE} className="text-sm font-semibold text-primary hover:underline">{text.register}</a></p>
        </section>

        <section className="bg-card py-14 md:py-20">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left lg:px-8">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.businessEyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">{text.businessTitle}</h2>
            </div>
            <Button variant="outline" size="lg" className="rounded-xl" asChild><a href={getRoutePath("home", language)}>{text.businessCta}<ArrowRight className="h-4 w-4" /></a></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLandingPage;
