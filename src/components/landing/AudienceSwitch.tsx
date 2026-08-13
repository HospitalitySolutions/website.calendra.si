import { getRoutePath } from "@/lib/localized-routes";
import type { SiteLanguage } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type AudienceSwitchProps = {
  language: SiteLanguage;
  audience: "customers" | "business";
  className?: string;
};

const AudienceSwitch = ({ language, audience, className }: AudienceSwitchProps) => {
  const businessPath = getRoutePath("home", language);
  const customerPath = getRoutePath("customers", language);

  return (
    <div className={cn("inline-flex rounded-xl border border-border/70 bg-background p-1 shadow-sm", className)}>
      <a
        href={customerPath}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
          audience === "customers" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {language === "sl" ? "Za stranke" : "For customers"}
      </a>
      <a
        href={businessPath}
        className={cn(
          "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
          audience === "business" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {language === "sl" ? "Za podjetja" : "For business"}
      </a>
    </div>
  );
};

export default AudienceSwitch;
