import Footer from "@/components/landing/Footer";
import Navbar from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { getLanguageFromPathname, getRoutePath } from "@/lib/localized-routes";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const language = getLanguageFromPathname(location.pathname);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const copy = language === "sl"
    ? {
        eyebrow: "Napaka 404",
        title: "Te strani ni mogoče najti.",
        body: "Povezava je morda zastarela ali pa je bila stran premaknjena. Vrnite se na domačo stran Calendre.",
        cta: "Nazaj na domačo stran",
      }
    : {
        eyebrow: "Error 404",
        title: "We couldn’t find this page.",
        body: "The link may be out of date or the page may have moved. Return to the Calendra homepage to continue.",
        cta: "Back to the homepage",
      };

  return (
    <div className="marketing-page marketing-redesign min-h-screen">
      <Navbar />
      <main>
        <section className="flex min-h-[62vh] items-center py-20 md:py-28">
          <div className="container mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="marketing-eyebrow">{copy.eyebrow}</span>
              <p className="mt-5 font-display text-[7rem] font-extrabold leading-none tracking-[-0.08em] text-primary/15 sm:text-[10rem]">404</p>
              <h1 className="marketing-section-title -mt-5 text-4xl sm:text-5xl lg:text-[4rem]">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{copy.body}</p>
              <Button variant="hero" size="lg" className="mt-8 rounded-[10px] shadow-none" asChild>
                <a href={getRoutePath("home", language)}>
                  {copy.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
