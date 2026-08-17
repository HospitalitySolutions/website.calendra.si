import { Button } from "@/components/ui/button";
import { TRIAL_SIGNUP_ROUTE } from "@/lib/routes";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const FinalCta = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).finalCta;
  const benefits = language === "sl" ? ["14 dni brezplačno", "Brez kreditne kartice", "Preklic kadar koli"] : ["14-day free trial", "No credit card required", "Cancel anytime"];
  return (
    <section className="relative overflow-hidden bg-transparent py-16 md:py-20 lg:py-24">
      <div className="container relative mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <div className="marketing-panel relative mx-auto overflow-hidden rounded-[32px] px-6 py-12 text-center sm:px-10 md:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -left-20 bottom-[-7rem] h-64 w-[34rem] rounded-[50%] bg-primary/[0.11] blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-[-7rem] h-64 w-[34rem] rounded-[50%] bg-accent/[0.12] blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <span className="marketing-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary"><Sparkles className="h-4 w-4" />Calendra</span>
            <h2 className="marketing-section-title mt-5 text-3xl sm:text-4xl lg:text-5xl">{copy.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{copy.description}</p>
            <Button variant="hero" size="lg" className="mt-8 h-14 rounded-[14px] px-9 text-base font-semibold shadow-[0_16px_38px_-16px_hsl(var(--primary)/0.6)]" asChild><a href={TRIAL_SIGNUP_ROUTE}>{copy.button}<ArrowRight className="ml-2 h-5 w-5" /></a></Button>
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-muted-foreground sm:text-sm">{benefits.map((benefit) => <span key={benefit} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" />{benefit}</span>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FinalCta;
