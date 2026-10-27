import { useLocation } from "react-router-dom";
import { getRouteKeyFromPathname } from "@/lib/localized-routes";
import FitnessLandingPage from "./FitnessLandingPage";
import StandardIndustryDetailPage from "./StandardIndustryDetailPage";

/** Keep the specialised fitness design isolated from all other industry pages. */
const IndustryDetailPage = () => {
  const { pathname } = useLocation();
  return getRouteKeyFromPathname(pathname) === "fitnessPersonalTraining"
    ? <FitnessLandingPage />
    : <StandardIndustryDetailPage />;
};

export default IndustryDetailPage;
