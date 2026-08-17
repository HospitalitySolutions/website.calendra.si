import { ArrowRight } from "lucide-react";
import type { CanonicalRouteKey } from "@/lib/localized-routes";
import { getRelatedPages } from "@/lib/related-pages";
import { useSiteLanguage } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type RelatedPagesProps = {
  routeKey: CanonicalRouteKey;
  title?: string;
  limit?: number;
  className?: string;
  variant?: "cards" | "pills";
};

/**
 * One related-links block for every page template. Replaces four hand-rolled
 * inline variants and, more importantly, is driven by an explicit graph in
 * `src/lib/related-pages.ts` so cross-cluster links (feature to industry) exist
 * instead of every page linking only within its own section.
 */
const RelatedPages = ({ routeKey, title, limit = 6, className, variant = "cards" }: RelatedPagesProps) => {
  const { language } = useSiteLanguage();
  const links = getRelatedPages(routeKey, language, limit);

  if (links.length === 0) return null;

  const heading = title ?? (language === "sl" ? "Povezane strani" : "Related pages");

  return (
    <section className={cn("border-t border-border/45 bg-transparent py-14 md:py-20", className)} aria-labelledby={`related-${routeKey}`}>
      <div className="container mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-8">
        <h2 id={`related-${routeKey}`} className="font-display text-2xl font-bold text-foreground">
          {heading}
        </h2>

        {variant === "pills" ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {links.map((link) => (
              <a
                key={link.routeKey}
                href={link.href}
                className="marketing-card inline-flex items-center gap-2 rounded-full bg-white/92 px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/30 hover:text-primary"
              >
                {link.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <a
                key={link.routeKey}
                href={link.href}
                className="marketing-card marketing-card-hover group flex flex-col rounded-[20px] bg-white/92 p-5"
              >
                <span className="flex items-center gap-2 font-semibold text-foreground group-hover:text-primary">
                  {link.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </span>
                <span className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{link.description}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedPages;
