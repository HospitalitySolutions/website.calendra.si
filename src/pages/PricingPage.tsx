import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Check, Laptop, ShieldCheck, Wrench } from "lucide-react";

const PricingPage = () => {
  const { language } = useSiteLanguage();
  const copy = language === "sl"
    ? {
        eyebrow: "Ločene IT storitve",
        title: "Potrebujete tudi spletno stran ali IT-podporo?",
        body: "Naročnina Calendra vključuje uporabo aplikacije in podporo skladno z izbranim paketom. Izdelava spletnih strani, poslovna e-pošta, varnostne kopije, avtomatizacije in druga IT-podpora se dogovorijo ločeno glede na obseg.",
        items: ["Enkratni IT-projekti", "Pomoč po urah", "Mesečna IT-podpora za mala podjetja"],
        cta: "Preglejte IT storitve",
      }
    : {
        eyebrow: "Separate IT services",
        title: "Do you also need a website or IT support?",
        body: "A Calendra subscription covers use of the application and support included in the selected plan. Website work, business email, backups, automation and other IT support are agreed separately based on scope.",
        items: ["One-off IT projects", "Hourly support", "Monthly IT support for small businesses"],
        cta: "Explore IT services",
      };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pb-16 pt-8 md:pb-20 md:pt-10">
        <Pricing standalone />
        <section className="container mx-auto -mt-16 px-4 pb-16 lg:px-8 md:-mt-20">
          <div className="overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-card to-accent/[0.06] p-8 shadow-soft md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <span className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{copy.eyebrow}</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{copy.title}</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{copy.body}</p>
                <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild>
                  <a href={getRoutePath("itServices", language)}>{copy.cta}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
              <div className="rounded-3xl border border-border/60 bg-background p-6">
                <div className="flex items-center gap-3 text-primary"><Laptop className="h-6 w-6" /><Wrench className="h-6 w-6" /><ShieldCheck className="h-6 w-6" /></div>
                <ul className="mt-6 grid gap-4">
                  {copy.items.map((item) => <li key={item} className="flex items-start gap-3 font-medium text-foreground"><Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
