import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./AppRoutes.tsx";
import { canonicalPathnames, getLanguageFromPathname } from "@/lib/localized-routes";
import { SiteLanguageProvider } from "@/lib/site-language";
import { DEFAULT_OG_IMAGE, getSeoForPathname } from "@/lib/seo";

export const routesToPrerender = canonicalPathnames;
export { DEFAULT_OG_IMAGE };

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

  return {
    appHtml,
    seo: getSeoForPathname(pathname),
  };
};
