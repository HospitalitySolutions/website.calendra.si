import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const AITransparency = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).aiTransparencyPage;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pb-16 pt-12 md:pb-20 md:pt-16">
        <div className="container mx-auto max-w-4xl px-4 lg:px-8">
          <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-soft md:p-10">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-sm font-semibold text-primary">
              {copy.badge}
            </div>

            <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ color: "hsl(var(--text-heading))" }}>
              {copy.title}
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{copy.intro}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {copy.cards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-border/60 bg-background/70 p-5">
                  <h2 className="text-base font-semibold text-foreground">{card.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border/60 bg-muted/40 p-5">
              <h2 className="text-lg font-semibold text-foreground">{copy.disclosureTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.disclosureBody1}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.disclosureBody2}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.disclosureBody3}</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AITransparency;
