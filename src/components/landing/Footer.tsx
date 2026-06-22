import calendraLogo from "@/assets/calendra-logo.png";
import { getSiteCopy } from "@/lib/site-copy";
import { useSiteLanguage } from "@/lib/site-language";
import { getRoutePath } from "@/lib/localized-routes";

const Footer = () => {
  const { language } = useSiteLanguage();
  const copy = getSiteCopy(language).footer;
  const homePath = getRoutePath("home", language);
  const privacyPath = getRoutePath("privacy", language);

  return (
    <footer className="border-t border-border/60 bg-background py-12">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row lg:px-8">
        <a href={homePath} className="flex items-center">
          <img src={calendraLogo} alt="Calendra" className="h-10 w-auto" />
        </a>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Calendra. {copy.rights}
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <a href={getRoutePath("clients", language)} className="transition-colors hover:text-foreground">
            {copy.clients}
          </a>
          <a href={getRoutePath("booking", language)} className="transition-colors hover:text-foreground">
            {copy.booking}
          </a>
          <a href={getRoutePath("support", language)} className="transition-colors hover:text-foreground">
            {copy.support}
          </a>
          <a href={privacyPath} className="transition-colors hover:text-foreground">
            {copy.privacy}
          </a>
          <a href={`${privacyPath}#google-limited-use`} className="transition-colors hover:text-foreground">
            Google Limited Use
          </a>
          <a href={`${privacyPath}#kontakt-in-pravice`} className="transition-colors hover:text-foreground">
            {copy.privacyContact}
          </a>
          <a href={getRoutePath("terms", language)} className="transition-colors hover:text-foreground">
            {copy.terms}
          </a>
          <a href={getRoutePath("accountDeletion", language)} className="transition-colors hover:text-foreground">
            {copy.accountDeletion}
          </a>
          <a href={getRoutePath("aiTransparency", language)} className="transition-colors hover:text-foreground">
            {copy.aiTransparency}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
