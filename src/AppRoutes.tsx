import { Navigate, Route, Routes } from "react-router-dom";
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
import LegalCenter from "./pages/LegalCenter.tsx";
import DataProcessingAgreement from "./pages/DataProcessingAgreement.tsx";
import Subprocessors from "./pages/Subprocessors.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import Security from "./pages/Security.tsx";
import DataRights from "./pages/DataRights.tsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/en" element={<Index />} />

    <Route path="/zasebnost" element={<PrivacyPolicy />} />
    <Route path="/en/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/privacy-policy" element={<Navigate to="/en/privacy-policy" replace />} />

    <Route path="/pogoji-uporabe" element={<TermsOfService />} />
    <Route path="/en/terms-of-service" element={<TermsOfService />} />
    <Route path="/terms-of-service" element={<Navigate to="/en/terms-of-service" replace />} />

    <Route path="/pravno" element={<LegalCenter />} />
    <Route path="/en/legal" element={<LegalCenter />} />
    <Route path="/legal" element={<Navigate to="/en/legal" replace />} />

    <Route path="/pogodba-o-obdelavi-podatkov" element={<DataProcessingAgreement />} />
    <Route path="/en/data-processing-agreement" element={<DataProcessingAgreement />} />
    <Route path="/data-processing-agreement" element={<Navigate to="/en/data-processing-agreement" replace />} />
    <Route path="/dpa" element={<Navigate to="/en/data-processing-agreement" replace />} />

    <Route path="/podobdelovalci" element={<Subprocessors />} />
    <Route path="/en/subprocessors" element={<Subprocessors />} />
    <Route path="/subprocessors" element={<Navigate to="/en/subprocessors" replace />} />

    <Route path="/piskotki" element={<CookiePolicy />} />
    <Route path="/en/cookie-policy" element={<CookiePolicy />} />
    <Route path="/cookie-policy" element={<Navigate to="/en/cookie-policy" replace />} />
    <Route path="/cookies" element={<Navigate to="/en/cookie-policy" replace />} />

    <Route path="/varnost" element={<Security />} />
    <Route path="/en/security" element={<Security />} />
    <Route path="/security" element={<Navigate to="/en/security" replace />} />

    <Route path="/pravice-posameznikov" element={<DataRights />} />
    <Route path="/en/data-rights" element={<DataRights />} />
    <Route path="/data-rights" element={<Navigate to="/en/data-rights" replace />} />

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
);

export default AppRoutes;
