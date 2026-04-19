import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { LEGAL } from "@/lib/legal";
import { LOGIN_ROUTE } from "@/lib/routes";
import { Link2 } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { BookOpen, Clock, Headphones, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const Support = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).supportPage;

  const loginHost = (() => {
    try {
      return new URL(LOGIN_ROUTE).hostname;
    } catch {
      return LOGIN_ROUTE;
    }
  })();

  const mailtoHref = `mailto:${LEGAL.supportEmail}?subject=${encodeURIComponent(copy.mailtoSubject)}&body=${encodeURIComponent(copy.mailtoBody)}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-12">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
                {copy.badge}
              </span>
              <h1
                className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
                style={{ color: "hsl(var(--text-heading))" }}
              >
                {copy.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Headphones className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.appAccessTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                {copy.appAccessLine1}{" "}
                <a
                  className="font-medium text-primary underline underline-offset-4 hover:text-primary/90"
                  href={LOGIN_ROUTE}
                  rel="noopener noreferrer"
                >
                  {loginHost}/login
                </a>
                {copy.appAccessLine2}
              </p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.openCaseTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{copy.openCaseBody}</p>
              <div className="mt-6">
                <Button asChild size="lg" className="font-semibold">
                  <a href={mailtoHref}>{copy.openCaseCta}</a>
                </Button>
              </div>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.contactTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                <strong className="text-foreground">{copy.contactEmailLabel} </strong>
                <a className="underline underline-offset-4" href={`mailto:${LEGAL.supportEmail}`}>
                  {LEGAL.supportEmail}
                </a>
              </p>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                <strong className="text-foreground">{copy.contactPhoneLabel} </strong>
                <a className="underline underline-offset-4" href={`tel:${LEGAL.supportPhoneTel}`}>
                  {LEGAL.supportPhone}
                </a>
              </p>
              <p className="mt-3 flex items-start gap-2 text-base leading-7 text-muted-foreground">
                <Clock className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span>
                  <strong className="text-foreground">{copy.contactHoursLabel}</strong> {copy.contactHoursValue}
                </span>
              </p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.slaTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{copy.slaBody}</p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.liveTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{copy.liveBody}</p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{copy.kbTitle}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{copy.kbBody}</p>
            </section>

            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/[0.08] text-primary">
                  <Link2 className="h-5 w-5" />
                </div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">{language === "sl" ? "Vodnik za Zoom integracijo" : "Zoom integration guide"}</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">
                {language === "sl"
                  ? "Javna dokumentacija za Zoom Marketplace vključuje navodila za povezavo, uporabo, odstranjevanje avtorizacije in odpravljanje težav za Zoom v Calendri."
                  : "Public Zoom Marketplace documentation with setup, usage, removal, and troubleshooting steps for Zoom in Calendra."}
              </p>
              <div className="mt-6">
                <Button asChild size="lg" variant="outline" className="font-semibold">
                  <a href={language === "sl" ? "/zoom-integracija" : "/zoom-integration"}>
                    {language === "sl" ? "Odpri Zoom dokumentacijo" : "Open Zoom documentation"}
                  </a>
                </Button>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
