import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppRoutes from "./AppRoutes.tsx";
import { SiteLanguageProvider } from "@/lib/site-language";
import SeoManager from "@/components/seo/SeoManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteLanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SeoManager />
          <AppRoutes />
        </BrowserRouter>
      </SiteLanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
