import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { canonicalRoutes, type CanonicalRouteKey } from "@/lib/localized-routes";
import { getRouteLinkLabel } from "@/lib/related-pages";
import { useSiteLanguage } from "@/lib/site-language";
import { cn } from "@/lib/utils";

type PageBreadcrumbsProps = {
  routeKey: CanonicalRouteKey;
  /** Intermediate hop between Home and the current page, e.g. IT services. */
  parentRouteKey?: CanonicalRouteKey;
  className?: string;
};

/**
 * Visible counterpart to the BreadcrumbList JSON-LD emitted for every route in
 * `src/lib/seo.ts`. Google expects the markup and the rendered trail to agree,
 * and a visible trail also gives deep pages an upward internal link.
 */
const PageBreadcrumbs = ({ routeKey, parentRouteKey, className }: PageBreadcrumbsProps) => {
  const { language } = useSiteLanguage();

  if (routeKey === "home") return null;

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={canonicalRoutes.home[language]}>
            {language === "sl" ? "Domov" : "Home"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parentRouteKey ? (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={canonicalRoutes[parentRouteKey][language]}>
                {getRouteLinkLabel(parentRouteKey, language)}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        ) : null}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{getRouteLinkLabel(routeKey, language)}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default PageBreadcrumbs;
