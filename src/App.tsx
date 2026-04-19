import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Booking from "./pages/Booking.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Support from "./pages/Support.tsx";
import ZoomIntegration from "./pages/ZoomIntegration.tsx";
import AITransparency from "./pages/AITransparency.tsx";
import { SiteLanguageProvider } from "@/lib/site-language";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteLanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/zasebnost" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/pogoji-uporabe" element={<TermsOfService />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/narocanje" element={<Booking />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/cenik" element={<PricingPage />} />
            <Route path="/support" element={<Support />} />
            <Route path="/podpora" element={<Support />} />
            <Route path="/zoom" element={<ZoomIntegration />} />
            <Route path="/zoom-integration" element={<ZoomIntegration />} />
            <Route path="/zoom-integracija" element={<ZoomIntegration />} />
            <Route path="/ai-transparency" element={<AITransparency />} />
            <Route path="/ai-transparentnost" element={<AITransparency />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteLanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
