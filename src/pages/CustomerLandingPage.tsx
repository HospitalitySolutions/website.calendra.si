import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CUSTOMER_LOGIN_ROUTE, CUSTOMER_REGISTER_ROUTE } from "@/lib/routes";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { useCustomerSession } from "@/lib/customer-session";
import {
  ArrowRight,
  CalendarCheck2,
  Dumbbell,
  Flower2,
  HeartPulse,
  MapPin,
  MessagesSquare,
  Scissors,
  Search,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";

const CustomerLandingPage = () => {
  const { language } = useSiteLanguage();
  const { isAuthenticated } = useCustomerSession();
  const providersPath = getRoutePath("businesses", language);
  const connectPath = getRoutePath("connect", language);

  const text = language === "sl" ? {
    title: "Poiščite ponudnika in rezervirajte termin",
    subtitle: "Enostavno poiščite storitve v svoji bližini in rezervirajte termin, ki vam ustreza.",
    what: "Kaj iščete?",
    whatPlaceholder: "Masaža, frizer, svetovanje …",
    where: "Kje?",
    wherePlaceholder: "Vnesite naslov ali kraj …",
    search: "Poišči",
    popular: "Priljubljene kategorije",
    categories: [
      ["Salon", "salon", Scissors],
      ["Fitnes", "fitness", Dumbbell],
      ["Wellness", "wellness", Flower2],
      ["Zdravje", "health", HeartPulse],
      ["Svetovanje", "consulting", MessagesSquare],
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
    title: "Find a provider and book an appointment",
    subtitle: "Find services near you and book an appointment that suits you.",
    what: "What are you looking for?",
    whatPlaceholder: "Massage, hairdresser, counselling …",
    where: "Where?",
    wherePlaceholder: "Enter an address or place …",
    search: "Search",
    popular: "Popular categories",
    categories: [
      ["Salon", "salon", Scissors],
      ["Fitness", "fitness", Dumbbell],
      ["Wellness", "wellness", Flower2],
      ["Health", "health", HeartPulse],
      ["Consulting", "consulting", MessagesSquare],
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
    <div className="customer-surface min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="py-14 md:py-20 lg:py-24">
          <div className="container mx-auto max-w-7xl px-4 text-center lg:px-8">
            <h1 className="mx-auto font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl lg:whitespace-nowrap lg:text-[2.65rem] lg:leading-[1.1]">
              {text.title}
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {text.subtitle}
            </p>

            <form
              action={providersPath}
              method="get"
              className="mx-auto mt-10 grid max-w-5xl gap-4 text-left md:grid-cols-[1.15fr_0.95fr_auto] md:items-end md:gap-5"
            >
              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.what}</span>
                <span className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder={text.whatPlaceholder}
                    className="h-14 rounded-2xl border-border/80 bg-transparent pl-12 text-base shadow-none transition focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/10"
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-semibold text-foreground">
                <span>{text.where}</span>
                <span className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    name="location"
                    placeholder={text.wherePlaceholder}
                    aria-label={text.where}
                    autoComplete="street-address"
                    className="h-14 rounded-2xl border-border/80 bg-transparent pl-12 text-base shadow-none transition focus-visible:border-primary/70 focus-visible:ring-2 focus-visible:ring-primary/10"
                  />
                </span>
              </label>

              <Button type="submit" variant="hero" size="lg" className="h-14 rounded-2xl px-8 shadow-soft">
                {text.search}<ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mx-auto mt-10 max-w-4xl text-center">
              <p className="text-sm font-semibold text-foreground">{text.popular}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {text.categories.map(([label, category, Icon]) => (
                  <a
                    key={category}
                    href={`${providersPath}?category=${category}#kategorije`}
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/35 hover:text-primary hover:shadow-sm"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-14 lg:px-8 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.benefitsEyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-foreground md:text-4xl">{text.benefitsTitle}</h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {text.benefits.map(([title, body, Icon]) => (
              <article key={title} className="flex items-start gap-4 px-2 py-2 text-left">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/[0.07] text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground md:text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">{body}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button variant="hero" size="lg" className="rounded-xl" asChild>
              <a href={connectPath}>{text.connectCta}<ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl bg-transparent" asChild>
              <a href={isAuthenticated ? "/racun" : `${CUSTOMER_LOGIN_ROUTE}?next=${encodeURIComponent(getRoutePath("customers", language))}`}>
                {isAuthenticated ? (language === "sl" ? "Odpri moj račun" : "Open my account") : text.login}
              </a>
            </Button>
          </div>
          {!isAuthenticated ? <p className="mt-4 text-center">
            <a href={CUSTOMER_REGISTER_ROUTE} className="text-sm font-semibold text-primary hover:underline">{text.register}</a>
          </p> : null}
        </section>

        <section className="py-14 md:py-20">
          <div className="container mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-4 text-center md:flex-row md:text-left lg:px-8">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-primary">{text.businessEyebrow}</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">{text.businessTitle}</h2>
            </div>
            <Button variant="outline" size="lg" className="rounded-xl bg-transparent" asChild>
              <a href={getRoutePath("home", language)}>{text.businessCta}<ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLandingPage;
