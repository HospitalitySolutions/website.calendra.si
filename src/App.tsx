import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import TermsOfService from "./pages/TermsOfService.tsx";
import Booking from "./pages/Booking.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import ClientsPage from "./pages/ClientsPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Support from "./pages/Support.tsx";
import ZoomIntegration from "./pages/ZoomIntegration.tsx";
import AITransparency from "./pages/AITransparency.tsx";
import AccountDeletion from "./pages/AccountDeletion.tsx";
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
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/en" element={<Index />} />

            <Route path="/zasebnost" element={<PrivacyPolicy />} />
            <Route path="/en/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/privacy-policy" element={<Navigate to="/en/privacy-policy" replace />} />

            <Route path="/pogoji-uporabe" element={<TermsOfService />} />
            <Route path="/en/terms-of-service" element={<TermsOfService />} />
            <Route path="/terms-of-service" element={<Navigate to="/en/terms-of-service" replace />} />

            <Route path="/narocanje" element={<Booking />} />
            <Route path="/en/booking" element={<Booking />} />
            <Route path="/booking" element={<Navigate to="/en/booking" replace />} />

            <Route path="/cenik" element={<PricingPage />} />
            <Route path="/en/pricing" element={<PricingPage />} />
            <Route path="/pricing" element={<Navigate to="/en/pricing" replace />} />

            <Route path="/stranke" element={<ClientsPage />} />
            <Route path="/en/clients" element={<ClientsPage />} />
            <Route path="/clients" element={<Navigate to="/en/clients" replace />} />

            <Route path="/podpora" element={<Support />} />
            <Route path="/en/support" element={<Support />} />
            <Route path="/support" element={<Navigate to="/en/support" replace />} />

            <Route path="/zoom-integracija" element={<ZoomIntegration />} />
            <Route path="/en/zoom-integration" element={<ZoomIntegration />} />
            <Route path="/zoom" element={<Navigate to="/en/zoom-integration" replace />} />
            <Route path="/zoom-integration" element={<Navigate to="/en/zoom-integration" replace />} />

            <Route path="/ai-transparentnost" element={<AITransparency />} />
            <Route path="/en/ai-transparency" element={<AITransparency />} />
            <Route path="/ai-transparency" element={<Navigate to="/en/ai-transparency" replace />} />

            <Route path="/izbris-racuna" element={<AccountDeletion />} />
            <Route path="/en/account-deletion" element={<AccountDeletion />} />
            <Route path="/account-deletion" element={<Navigate to="/en/account-deletion" replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteLanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
