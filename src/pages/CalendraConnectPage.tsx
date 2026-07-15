import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import CalendraConnectLogo from "@/components/connect/CalendraConnectLogo";
import StoreButtons from "@/components/connect/StoreButtons";
import { Button } from "@/components/ui/button";
import { getCalendraConnectCopy } from "@/lib/calendra-connect";
import { getRoutePath } from "@/lib/localized-routes";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import {
  ArrowRight,
  BellRing,
  CalendarCheck2,
  CalendarClock,
  Check,
  CreditCard,
  MapPin,
  MessageCircleMore,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  TicketCheck,
  UserRoundSearch,
  WalletCards,
} from "lucide-react";

const previewIcons = [CalendarClock, CalendarCheck2, WalletCards] as const;
const featureIcons = [CalendarCheck2, RefreshCw, BellRing, CreditCard, TicketCheck, UserRoundSearch] as const;
const stepIcons = [Smartphone, UserRoundSearch, CalendarCheck2] as const;

const PhonePreview = ({ screen, index }: { screen: { label: string; title: string; primary: string; secondary: string; action: string }; index: number }) => {
  const Icon = previewIcons[index];
  return (
    <div className={`relative mx-auto w-full max-w-[260px] rounded-[2.7rem] border-[7px] border-foreground bg-background p-3 shadow-2xl ${index === 1 ? "lg:-translate-y-7" : ""}`}>
      <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-foreground" aria-hidden="true" />
      <div className="min-h-[470px] overflow-hidden rounded-[2rem] bg-card px-4 pb-5 pt-10">
        <div className="flex items-center justify-between">
          <img src="/connect/calendra-connect-icon.png" alt="" width="48" height="48" className="h-10 w-10 rounded-xl" aria-hidden="true" />
          <span className="rounded-full bg-primary/[0.09] px-3 py-1 text-[0.65rem] font-bold text-primary">{screen.label}</span>
        </div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Calendra Connect</p>
        <p className="mt-2 font-display text-xl font-bold text-foreground">{screen.title}</p>
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-primary/75 p-5 text-primary-foreground shadow-glow">
          <Icon className="h-7 w-7" aria-hidden="true" />
          <p className="mt-7 text-base font-bold">{screen.primary}</p>
          <p className="mt-1 text-xs text-primary-foreground/80">{screen.secondary}</p>
        </div>
        <div className="mt-4 grid gap-3">
          {[0, 1].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-3">
              <span className="h-9 w-9 rounded-xl bg-secondary" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block h-2 w-4/5 rounded-full bg-muted" />
                <span className="mt-2 block h-2 w-2/5 rounded-full bg-muted" />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl bg-accent px-4 py-3 text-center text-xs font-bold text-accent-foreground">{screen.action}</div>
      </div>
    </div>
  );
};

const CalendraConnectPage = () => {
  const { language } = useSiteLanguage();
  const copy = getCalendraConnectCopy(language);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/[0.08] via-background to-accent/[0.08] py-20 md:py-28">
          <div className="absolute -right-36 -top-36 h-[32rem] w-[32rem] rounded-full bg-primary/[0.08] blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-52 -left-28 h-[30rem] w-[30rem] rounded-full bg-accent/[0.10] blur-3xl" aria-hidden="true" />
          <div className="container relative mx-auto grid items-center gap-14 px-4 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
                <Smartphone className="h-4 w-4" aria-hidden="true" />
                {copy.hero.eyebrow}
              </span>
              <CalendraConnectLogo className="mt-7 w-full max-w-[430px]" />
              <h1 className="mt-7 font-display font-extrabold tracking-tight text-foreground">
                <span className="block text-2xl text-primary sm:text-3xl">{copy.hero.titleBrand}</span>
                <span className="mt-2 block text-4xl sm:text-5xl lg:text-6xl">{copy.hero.title}</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.hero.description}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                {copy.hero.free}
              </div>
              <StoreButtons className="mt-8" />
            </div>

            <div aria-label={copy.hero.preview}>
              <div className="grid items-end gap-5 sm:grid-cols-3">
                {copy.preview.screens.map((screen, index) => <PhonePreview key={screen.label} screen={screen} index={index} />)}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.features.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.features.title}</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{copy.features.intro}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {copy.features.items.map((item, index) => {
                const Icon = featureIcons[index];
                return (
                  <article key={item.title} className="rounded-3xl border border-border/60 bg-background p-7 shadow-soft">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.09] text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                    <h3 className="mt-6 text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.steps.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.steps.title}</h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {copy.steps.items.map((item, index) => {
                const Icon = stepIcons[index];
                return (
                  <article key={item.title} className="relative rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
                    <span className="absolute right-6 top-5 font-display text-5xl font-black text-primary/[0.08]" aria-hidden="true">0{index + 1}</span>
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/[0.09] text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                    <h3 className="mt-6 text-xl font-bold text-foreground">{item.title}</h3>
                    <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.09] via-background to-accent/[0.09] p-8 shadow-soft md:p-12">
              <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.business.eyebrow}</span>
                  <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.business.title}</h2>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.business.body}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button variant="hero" size="lg" className="rounded-xl" asChild>
                      <a href={TRIAL_SIGNUP_ROUTE}>{copy.business.primary}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-xl" asChild>
                      <a href={getRoutePath("booking", language)}>{copy.business.secondary}</a>
                    </Button>
                  </div>
                </div>
                <div className="mx-auto grid w-full max-w-md gap-4 rounded-3xl border border-border/70 bg-background p-6 shadow-soft">
                  {[MessageCircleMore, CreditCard, TicketCheck].map((Icon, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-2xl bg-card p-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/[0.08] text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="min-w-0 flex-1">
                        <span className="block h-2.5 w-3/4 rounded-full bg-muted" />
                        <span className="mt-2 block h-2 w-1/2 rounded-full bg-muted" />
                      </span>
                      <Check className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2 lg:px-8">
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <ShieldCheck className="h-9 w-9 text-primary" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-bold text-foreground">{copy.trust.title}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{copy.trust.body}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button variant="outline" className="rounded-xl" asChild><a href={getRoutePath("privacy", language)}>{copy.trust.privacy}</a></Button>
                <Button variant="ghost" className="rounded-xl" asChild><a href={getRoutePath("support", language)}>{copy.trust.support}</a></Button>
              </div>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft">
              <MapPin className="h-9 w-9 text-accent" aria-hidden="true" />
              <h2 className="mt-6 font-display text-2xl font-bold text-foreground">{copy.preview.heading}</h2>
              <p className="mt-4 leading-7 text-muted-foreground">{copy.preview.body}</p>
              <Button variant="outline" className="mt-7 rounded-xl" asChild>
                <a href={getRoutePath("booking", language)}>{language === "sl" ? "Poiščite ponudnike v Calendri" : "Find providers on Calendra"}<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-card py-20 md:py-28">
          <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.faq.eyebrow}</span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.faq.title}</h2>
            </div>
            <div className="grid gap-3">
              {copy.faq.items.map((item) => (
                <details key={item.q} className="group rounded-2xl border border-border/60 bg-background p-5">
                  <summary className="cursor-pointer list-none font-semibold text-foreground marker:hidden">{item.q}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-background py-20 md:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid gap-10 overflow-hidden rounded-[2rem] bg-foreground p-8 text-background shadow-2xl md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{copy.download.eyebrow}</span>
                <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">{copy.download.title}</h2>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-background/70">{copy.download.body}</p>
                <StoreButtons className="mt-8" />
              </div>
              <div className="mx-auto rounded-3xl bg-white p-4 shadow-xl">
                <img src="/connect/calendra-connect-qr.png" alt={copy.download.qrAlt} width="540" height="540" loading="lazy" className="h-44 w-44 sm:h-52 sm:w-52" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CalendraConnectPage;
