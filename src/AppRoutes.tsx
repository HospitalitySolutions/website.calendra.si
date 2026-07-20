import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import IndexSsr from "./pages/Index.tsx";
import PrivacyPolicySsr from "./pages/PrivacyPolicy.tsx";
import TermsOfServiceSsr from "./pages/TermsOfService.tsx";
import PricingPageSsr from "./pages/PricingPage.tsx";
import ClientsPageSsr from "./pages/ClientsPage.tsx";
import PublicCompanyProfilePageSsr from "./pages/PublicCompanyProfilePage.tsx";
import FeatureDetailPageSsr from "./pages/FeatureDetailPage.tsx";
import IndustryDetailPageSsr from "./pages/IndustryDetailPage.tsx";
import CalendraConnectPageSsr from "./pages/CalendraConnectPage.tsx";
import ItServicesPageSsr from "./pages/ItServicesPage.tsx";
import ItServiceDetailPageSsr from "./pages/ItServiceDetailPage.tsx";
import ContactPageSsr from "./pages/ContactPage.tsx";
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

const Index = IndexSsr;
const PrivacyPolicy = import.meta.env.SSR ? PrivacyPolicySsr : lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = import.meta.env.SSR ? TermsOfServiceSsr : lazy(() => import("./pages/TermsOfService.tsx"));
const PricingPage = import.meta.env.SSR ? PricingPageSsr : lazy(() => import("./pages/PricingPage.tsx"));
const ClientsPage = import.meta.env.SSR ? ClientsPageSsr : lazy(() => import("./pages/ClientsPage.tsx"));
const PublicCompanyProfilePage = import.meta.env.SSR
  ? PublicCompanyProfilePageSsr
  : lazy(() => import("./pages/PublicCompanyProfilePage.tsx"));
const FeatureDetailPage = import.meta.env.SSR
  ? FeatureDetailPageSsr
  : lazy(() => import("./pages/FeatureDetailPage.tsx"));
const IndustryDetailPage = import.meta.env.SSR
  ? IndustryDetailPageSsr
  : lazy(() => import("./pages/IndustryDetailPage.tsx"));
const CalendraConnectPage = import.meta.env.SSR
  ? CalendraConnectPageSsr
  : lazy(() => import("./pages/CalendraConnectPage.tsx"));
const ItServicesPage = import.meta.env.SSR
  ? ItServicesPageSsr
  : lazy(() => import("./pages/ItServicesPage.tsx"));
const ItServiceDetailPage = import.meta.env.SSR
  ? ItServiceDetailPageSsr
  : lazy(() => import("./pages/ItServiceDetailPage.tsx"));
const ContactPage = import.meta.env.SSR
  ? ContactPageSsr
  : lazy(() => import("./pages/ContactPage.tsx"));
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

      <Route path="/narocanje" element={<ClientsPage />} />
      <Route path="/en/booking" element={<ClientsPage />} />
      <Route path="/podjetja/:slug" element={<PublicCompanyProfilePage />} />
      <Route path="/en/businesses/:slug" element={<PublicCompanyProfilePage />} />
      <Route path="/stranke" element={<Navigate to="/narocanje" replace />} />
      <Route path="/en/clients" element={<Navigate to="/en/booking" replace />} />
      <Route path="/clients" element={<Navigate to="/en/booking" replace />} />
      <Route path="/booking" element={<Navigate to="/en/booking" replace />} />

      <Route path="/koledar-terminov" element={<FeatureDetailPage />} />
      <Route path="/en/appointment-calendar" element={<FeatureDetailPage />} />
      <Route path="/racuni-in-placila" element={<FeatureDetailPage />} />
      <Route path="/en/invoicing-and-payments" element={<FeatureDetailPage />} />
      <Route path="/upravljanje-strank" element={<FeatureDetailPage />} />
      <Route path="/en/client-management" element={<FeatureDetailPage />} />
      <Route path="/sms-opomniki" element={<FeatureDetailPage />} />
      <Route path="/en/appointment-reminders" element={<FeatureDetailPage />} />
      <Route path="/integracije" element={<FeatureDetailPage />} />
      <Route path="/en/integrations" element={<FeatureDetailPage />} />

      <Route path="/za-lepotne-in-frizerske-salone" element={<IndustryDetailPage />} />
      <Route path="/en/for-beauty-and-hair-salons" element={<IndustryDetailPage />} />
      <Route path="/za-svetovalce-in-izobrazevalce" element={<IndustryDetailPage />} />
      <Route path="/en/for-consultants-and-educators" element={<IndustryDetailPage />} />
      <Route path="/za-zdravje-in-dobro-pocutje" element={<IndustryDetailPage />} />
      <Route path="/en/for-health-and-wellbeing" element={<IndustryDetailPage />} />
      <Route path="/za-fitnes-in-skupinske-storitve" element={<IndustryDetailPage />} />
      <Route path="/en/for-fitness-and-group-services" element={<IndustryDetailPage />} />

      <Route path="/calendra-connect" element={<CalendraConnectPage />} />
      <Route path="/en/calendra-connect" element={<CalendraConnectPage />} />
      <Route path="/mobilna-aplikacija" element={<Navigate to="/calendra-connect" replace />} />
      <Route path="/mobile-app" element={<Navigate to="/en/calendra-connect" replace />} />
      <Route path="/en/mobile-app" element={<Navigate to="/en/calendra-connect" replace />} />

      <Route path="/it-storitve" element={<ItServicesPage />} />
      <Route path="/en/it-services" element={<ItServicesPage />} />
      <Route path="/it-podpora-malim-podjetjem" element={<ItServiceDetailPage />} />
      <Route path="/en/small-business-it-support" element={<ItServiceDetailPage />} />
      <Route path="/izdelava-spletnih-strani" element={<ItServiceDetailPage />} />
      <Route path="/en/website-design-and-redesign" element={<ItServiceDetailPage />} />
      <Route path="/vzdrzevanje-spletnih-strani" element={<ItServiceDetailPage />} />
      <Route path="/en/website-maintenance" element={<ItServiceDetailPage />} />
      <Route path="/poslovna-e-posta" element={<ItServiceDetailPage />} />
      <Route path="/en/business-email" element={<ItServiceDetailPage />} />
      <Route path="/varnostne-kopije-in-it-varnost" element={<ItServiceDetailPage />} />
      <Route path="/en/backups-and-it-security" element={<ItServiceDetailPage />} />
      <Route path="/avtomatizacije-in-integracije" element={<ItServiceDetailPage />} />
      <Route path="/en/business-automation-and-integrations" element={<ItServiceDetailPage />} />
      <Route path="/kontakt" element={<ContactPage />} />
      <Route path="/en/contact" element={<ContactPage />} />

      <Route path="/cenik" element={<PricingPage />} />
      <Route path="/en/pricing" element={<PricingPage />} />
      <Route path="/pricing" element={<Navigate to="/en/pricing" replace />} />

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
