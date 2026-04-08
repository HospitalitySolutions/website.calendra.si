import calendraLogo from "@/assets/calendra-logo.png";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";

const Footer = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).footer;

  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row lg:px-8">
        <a href="/" className="flex items-center">
          <img src={calendraLogo} alt="Calendra" className="h-10 w-auto" />
        </a>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Calendra. {copy.rights}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href="/narocanje" className="transition-colors hover:text-foreground">{copy.booking}</a>
          <a href="/privacy-policy" className="transition-colors hover:text-foreground">{copy.privacy}</a>
          <a href="/privacy-policy#kontakt-in-pravice" className="transition-colors hover:text-foreground">{copy.privacyContact}</a>
          <a href="/terms-of-service" className="transition-colors hover:text-foreground">{copy.terms}</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
