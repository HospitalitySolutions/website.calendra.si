import { Bot, Sparkles, ShieldCheck } from "lucide-react";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const icons = [Bot, Sparkles, ShieldCheck] as const;

const AITransparencySection = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).aiTransparencySection;
  const details = [copy.cards.service, copy.cards.useCases, copy.cards.review];

  return (
    <section id="ai-transparency" className="scroll-mt-20 bg-background py-20 md:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
          <div className="max-w-3xl">
            <span className="text-sm font-semibold uppercase tracking-widest text-primary">{copy.eyebrow}</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "hsl(var(--text-heading))" }}>
              {copy.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{copy.description}</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {details.map((item, index) => {
              const Icon = icons[index];
              return (
                <div key={item.title} className="rounded-2xl border border-border/60 bg-background/70 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/[0.04] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">{copy.linkTitle}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{copy.linkBody}</p>
            </div>
            <a
              href={language === "sl" ? "/ai-transparentnost" : "/ai-transparency"}
              className="inline-flex items-center justify-center rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {copy.linkCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AITransparencySection;
