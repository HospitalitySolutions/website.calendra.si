import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import { SiteLanguageProvider } from "@/lib/site-language";
import SeoManager from "@/components/seo/SeoManager";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";
import DemoInvitation from "@/components/marketing/DemoInvitation";
import PromotionBanner from "@/components/marketing/PromotionBanner";

const App = () => (
  <SiteLanguageProvider>
    <BrowserRouter>
      <SeoManager />
      <GoogleAnalytics />
      {/* Client-only: renders nothing until after hydration, so the prerendered routes still match. */}
      <PromotionBanner />
      <AppRoutes />
      <CookieConsentBanner />
      <DemoInvitation />
    </BrowserRouter>
  </SiteLanguageProvider>
);

export default App;
