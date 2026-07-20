import { useEffect, useRef } from "react";
import { getDirectoryClientBookingPath, type DirectoryClient } from "@/lib/company-directory";
import type { SiteLanguage } from "@/lib/site-language";

type ClientBookingDialogProps = {
  client: DirectoryClient | null;
  language: SiteLanguage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Backwards-compatibility shim for legacy booking entry points.
 *
 * Booking no longer opens inside a modal. Any older component that still
 * toggles this dialog is sent to the standalone same-origin booking route.
 */
const ClientBookingDialog = ({ client, open, onOpenChange }: ClientBookingDialogProps) => {
  const lastNavigationRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !client || typeof window === "undefined") {
      if (!open) lastNavigationRef.current = null;
      return;
    }

    const bookingPath = getDirectoryClientBookingPath(client);
    if (lastNavigationRef.current === bookingPath) return;

    lastNavigationRef.current = bookingPath;
    onOpenChange(false);
    window.location.assign(bookingPath);
  }, [client, onOpenChange, open]);

  return null;
};

export default ClientBookingDialog;
