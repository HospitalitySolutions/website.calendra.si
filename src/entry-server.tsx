import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./AppRoutes.tsx";
import { canonicalPathnames, getLanguageFromPathname, sitemapRouteMetadata } from "@/lib/localized-routes";
import { SiteLanguageProvider } from "@/lib/site-language";
import { DEFAULT_OG_IMAGE, getSeoForPathname } from "@/lib/seo";
import { getPublicCompanyProfilePath, indexablePublicCompanyProfiles } from "@/lib/public-company-profiles";

const publicProfilePathnames = indexablePublicCompanyProfiles.flatMap((profile) => [
  getPublicCompanyProfilePath(profile.slug, "sl"),
  getPublicCompanyProfilePath(profile.slug, "en"),
]);

export const routesToPrerender = [...canonicalPathnames, ...publicProfilePathnames];
export { DEFAULT_OG_IMAGE };

export const getSitemapEntries = () =>
  routesToPrerender
    .map((pathname) => {
      const seo = getSeoForPathname(pathname);
      if (seo.noindex || !seo.alternateUrls) return undefined;

      if ("routeKey" in seo && seo.routeKey) {
        const metadata = sitemapRouteMetadata[seo.routeKey];
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: metadata.changeFrequency,
          priority: metadata.priority[seo.language],
          lastModified: metadata.lastModified,
        };
      }

      if ("profileSlug" in seo && seo.profileSlug) {
        const profile = indexablePublicCompanyProfiles.find((item) => item.slug === seo.profileSlug);
        return {
          pathname,
          location: seo.canonicalUrl,
          language: seo.language,
          alternateUrls: seo.alternateUrls,
          changeFrequency: "weekly" as const,
          priority: seo.language === "sl" ? 0.7 : 0.6,
          lastModified: profile?.lastModified,
        };
      }

      return undefined;
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

export const renderPage = (pathname: string) => {
  const queryClient = new QueryClient();
  const language = getLanguageFromPathname(pathname);

  const appHtml = renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SiteLanguageProvider initialLanguage={language}>
          <Toaster />
          <Sonner />
          <StaticRouter location={pathname}>
            <AppRoutes />
          </StaticRouter>
        </SiteLanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  );

  return { appHtml, seo: getSeoForPathname(pathname) };
};
