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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0754c9] via-[#0d63e5] to-[#0754c9] py-16 text-white md:py-20 lg:py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-300/16 blur-[90px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full border border-white/10" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-20 bottom-[-7rem] h-72 w-72 rounded-full border border-orange-300/20" aria-hidden="true" />
      <div className="container relative mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/45 px-4 py-1.5 text-sm font-semibold text-white"><Sparkles className="h-4 w-4" />Calendra</span>
          <h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.8rem]">{copy.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-50/88 sm:text-lg">{copy.description}</p>
          <Button size="lg" className="mt-8 h-14 rounded-[10px] bg-orange-500 px-9 text-base font-bold text-white shadow-[0_18px_38px_-14px_rgba(255,148,23,0.72)] hover:bg-orange-400" asChild>
            <a href={TRIAL_SIGNUP_ROUTE}>{copy.button}<ArrowRight className="ml-2 h-5 w-5" /></a>
          </Button>
          <div className="mt-6 flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs font-medium text-blue-50/88 sm:text-sm">
            {benefits.map((benefit) => <span key={benefit} className="inline-flex items-center gap-1.5"><span className="grid h-4 w-4 place-items-center rounded-full bg-white text-primary"><Check className="h-2.5 w-2.5" /></span>{benefit}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCta;
