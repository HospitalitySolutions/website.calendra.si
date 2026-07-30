import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import { SiteLanguageProvider } from "@/lib/site-language";
import SeoManager from "@/components/seo/SeoManager";

const App = () => (
  <SiteLanguageProvider>
    <BrowserRouter>
      <SeoManager />
      <AppRoutes />
    </BrowserRouter>
  </SiteLanguageProvider>
);

export default App;
