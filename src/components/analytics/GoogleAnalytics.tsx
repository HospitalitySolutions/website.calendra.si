import { useEffect } from "react";
import { initializeGoogleAnalytics } from "@/lib/google-analytics";
import { trackUmamiPageView } from "@/lib/analytics";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    initializeGoogleAnalytics();
    trackUmamiPageView();
  }, [pathname, search]);

  return null;
};

export default GoogleAnalytics;
