import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { BUSINESS_LOGIN_ROUTE, CUSTOMER_LOGIN_ROUTE } from "@/lib/routes";
import { useSiteLanguage } from "@/lib/site-language";
import { ArrowRight, Building2, UserRound } from "lucide-react";

const LoginChooserPage = () => {
  const { language } = useSiteLanguage();
  const text = language === "sl" ? {
    title: "Prijava v Calendro",
    intro: "Izberite, ali se prijavljate kot stranka ali kot uporabnik poslovne aplikacije.",
    customerTitle: "Za stranke",
    customerBody: "Preglejte svoje termine, pakete, članstva, bone in obvestila v Calendra Connect.",
    customerCta: "Prijava za stranke",
    businessTitle: "Za podjetja",
    businessBody: "Upravljajte koledar, stranke, storitve, račune, zaposlene in poslovalnice.",
    businessCta: "Prijava za podjetja",
  } : {
    title: "Log in to Calendra",
    intro: "Choose whether you are signing in as a customer or as a business app user.",
    customerTitle: "For customers",
    customerBody: "See your appointments, packages, memberships, gift cards and notifications in Calendra Connect.",
    customerCta: "Customer login",
    businessTitle: "For business",
    businessBody: "Manage your calendar, clients, services, invoices, employees and locations.",
    businessCta: "Business login",
  };

  return (
    <div className="marketing-page min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-16 lg:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">{text.title}</h1>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{text.intro}</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <article className="flex flex-col rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/[0.10] via-card to-card p-8 shadow-soft">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground"><UserRound className="h-7 w-7" /></span>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">{text.customerTitle}</h2>
            <p className="mt-3 flex-1 leading-7 text-muted-foreground">{text.customerBody}</p>
            <Button variant="hero" size="lg" className="mt-7 rounded-xl" asChild><a href={CUSTOMER_LOGIN_ROUTE}>{text.customerCta}<ArrowRight className="h-4 w-4" /></a></Button>
          </article>
          <article className="flex flex-col rounded-[2rem] border border-border/70 bg-card p-8 shadow-soft">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-foreground"><Building2 className="h-7 w-7" /></span>
            <h2 className="mt-6 font-display text-2xl font-extrabold text-foreground">{text.businessTitle}</h2>
            <p className="mt-3 flex-1 leading-7 text-muted-foreground">{text.businessBody}</p>
            <Button variant="outline" size="lg" className="mt-7 rounded-xl" asChild><a href={BUSINESS_LOGIN_ROUTE}>{text.businessCta}<ArrowRight className="h-4 w-4" /></a></Button>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginChooserPage;
