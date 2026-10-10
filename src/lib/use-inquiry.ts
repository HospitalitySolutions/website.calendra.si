import { useRef, useState } from "react";
import { sendInquiry, type Inquiry } from "@/lib/inquiry";
import { trackMarketingEvent } from "@/lib/marketing-events";

export const useInquiry = (language: "sl" | "en") => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const locked = useRef(false);
  const submit = async (inquiry: Inquiry, leadType: "calendra" | "it" | "enterprise") => {
    if (locked.current) return;
    locked.current = true;
    setStatus("sending");
    try {
      await sendInquiry(inquiry);
    } catch {
      locked.current = false;
      setStatus("error");
      return;
    }
    setStatus("sent");
    // Analytics must not turn a delivered inquiry into a retryable failure.
    try {
      trackMarketingEvent("generate_lead", { language, lead_type: leadType, delivery_method: "api" });
    } catch { /* Delivery remains confirmed if an optional tracker fails. */ }
  };
  return {
    submit, status, disabled: status === "sending" || status === "sent",
    message: status === "sent"
      ? language === "sl" ? "Hvala. Vaše sporočilo smo prejeli." : "Thank you. We received your message."
      : status === "error"
        ? language === "sl" ? "Pošiljanje ni bilo potrjeno. Poskusite znova ali nam pišite na info@calendra.si." : "Sending was not confirmed. Try again or email info@calendra.si."
        : status === "sending" ? language === "sl" ? "Pošiljanje …" : "Sending …" : "",
  };
};
