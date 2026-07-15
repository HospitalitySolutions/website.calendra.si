import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import IndexSsr from "./pages/Index.tsx";
import PrivacyPolicySsr from "./pages/PrivacyPolicy.tsx";
import TermsOfServiceSsr from "./pages/TermsOfService.tsx";
import BookingSsr from "./pages/Booking.tsx";
import PricingPageSsr from "./pages/PricingPage.tsx";
import ClientsPageSsr from "./pages/ClientsPage.tsx";
import NotFoundSsr from "./pages/NotFound.tsx";
import SupportSsr from "./pages/Support.tsx";
import ZoomIntegrationSsr from "./pages/ZoomIntegration.tsx";
import AITransparencySsr from "./pages/AITransparency.tsx";
import AccountDeletionSsr from "./pages/AccountDeletion.tsx";
import LegalCenterSsr from "./pages/LegalCenter.tsx";
import DataProcessingAgreementSsr from "./pages/DataProcessingAgreement.tsx";
import SubprocessorsSsr from "./pages/Subprocessors.tsx";
import CookiePolicySsr from "./pages/CookiePolicy.tsx";
import SecuritySsr from "./pages/Security.tsx";
import DataRightsSsr from "./pages/DataRights.tsx";

// The homepage is the primary entry route and stays in the initial bundle.
// All secondary routes are lazy-loaded in the browser, while prerendering uses
// synchronous components so every canonical URL still receives complete HTML.
const Index = IndexSsr;
const PrivacyPolicy = import.meta.env.SSR ? PrivacyPolicySsr : lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = import.meta.env.SSR ? TermsOfServiceSsr : lazy(() => import("./pages/TermsOfService.tsx"));
const Booking = import.meta.env.SSR ? BookingSsr : lazy(() => import("./pages/Booking.tsx"));
const PricingPage = import.meta.env.SSR ? PricingPageSsr : lazy(() => import("./pages/PricingPage.tsx"));
const ClientsPage = import.meta.env.SSR ? ClientsPageSsr : lazy(() => import("./pages/ClientsPage.tsx"));
const NotFound = import.meta.env.SSR ? NotFoundSsr : lazy(() => import("./pages/NotFound.tsx"));
const Support = import.meta.env.SSR ? SupportSsr : lazy(() => import("./pages/Support.tsx"));
const ZoomIntegration = import.meta.env.SSR ? ZoomIntegrationSsr : lazy(() => import("./pages/ZoomIntegration.tsx"));
const AITransparency = import.meta.env.SSR ? AITransparencySsr : lazy(() => import("./pages/AITransparency.tsx"));
const AccountDeletion = import.meta.env.SSR ? AccountDeletionSsr : lazy(() => import("./pages/AccountDeletion.tsx"));
const LegalCenter = import.meta.env.SSR ? LegalCenterSsr : lazy(() => import("./pages/LegalCenter.tsx"));
const DataProcessingAgreement = import.meta.env.SSR
  ? DataProcessingAgreementSsr
  : lazy(() => import("./pages/DataProcessingAgreement.tsx"));
const Subprocessors = import.meta.env.SSR ? SubprocessorsSsr : lazy(() => import("./pages/Subprocessors.tsx"));
const CookiePolicy = import.meta.env.SSR ? CookiePolicySsr : lazy(() => import("./pages/CookiePolicy.tsx"));
const Security = import.meta.env.SSR ? SecuritySsr : lazy(() => import("./pages/Security.tsx"));
const DataRights = import.meta.env.SSR ? DataRightsSsr : lazy(() => import("./pages/DataRights.tsx"));

const RouteFallback = () => <div className="min-h-screen bg-background" aria-hidden="true" />;

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
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
  </Suspense>
);

export default AppRoutes;
