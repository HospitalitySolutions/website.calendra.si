import { useEffect } from "react";
import { initializeGoogleAnalytics } from "@/lib/google-analytics";

const GoogleAnalytics = () => {
  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  return null;
};

export default GoogleAnalytics;
