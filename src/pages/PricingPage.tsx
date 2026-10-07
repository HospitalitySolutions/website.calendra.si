import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { getRoutePath } from "@/lib/localized-routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Check, Laptop, ShieldCheck, Wrench } from "lucide-react";
import "@/styles/pricing.css";

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
    <div className="marketing-page pricing-page min-h-screen bg-background">
      <Navbar />
      <main>
        <Pricing standalone />
        <section className="pricing-it-band" aria-labelledby="pricing-it-title">
          <div className="container mx-auto">
            <div className="pricing-it-layout">
              <div>
                <span className="marketing-eyebrow">{copy.eyebrow}</span>
                <h2 id="pricing-it-title" className="pricing-section-title mt-3">{copy.title}</h2>
                <p className="mt-4 text-muted-foreground leading-7">{copy.body}</p>
                <Button variant="hero" size="lg" className="pricing-button mt-6" asChild>
                  <a href={getRoutePath("itServices", language)}>{copy.cta}<ArrowRight className="h-4 w-4" /></a>
                </Button>
              </div>
              <div className="pricing-info-card">
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
