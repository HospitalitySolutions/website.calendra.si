import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import { SiteLanguageProvider } from "@/lib/site-language";
import SeoManager from "@/components/seo/SeoManager";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import CookieConsentBanner from "@/components/analytics/CookieConsentBanner";
import DemoInvitation from "@/components/marketing/DemoInvitation";

const App = () => (
  <SiteLanguageProvider>
    <BrowserRouter>
      <SeoManager />
      <GoogleAnalytics />
      <AppRoutes />
      <CookieConsentBanner />
      <DemoInvitation />
    </BrowserRouter>
  </SiteLanguageProvider>
);

export default App;
