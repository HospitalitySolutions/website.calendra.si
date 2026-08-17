import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const FinalCta = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).finalCta;
  const benefits = language === "sl"
    ? ["14 dni brezplačno", "Brez kreditne kartice", "Preklic kadar koli"]
    : ["14-day free trial", "No credit card required", "Cancel anytime"];

  return (
    <section className="relative overflow-hidden bg-transparent py-20 md:py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-r from-primary/[0.08] via-violet-400/[0.055] to-accent/[0.08] blur-[80px]" aria-hidden="true" />
      <div className="container relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="marketing-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" />Calendra</span>
          <h2 className="marketing-section-title mt-5 text-4xl sm:text-5xl lg:text-[3.6rem]">{copy.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
          <Button variant="hero" size="lg" className="mt-8 h-14 rounded-[13px] px-9 text-base font-semibold shadow-[0_16px_36px_-16px_hsl(var(--primary)/0.55)]" asChild>
            <a href={TRIAL_SIGNUP_ROUTE}>{copy.button}<ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">
            {benefits.map((benefit) => <span key={benefit} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" />{benefit}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
