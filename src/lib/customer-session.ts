import { useCallback, useEffect, useState } from "react";

export const CUSTOMER_TOKEN_KEY = "calendra.customer.token";

export type CustomerSessionUser = {
  id?: string | number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  profilePictureUrl?: string | null;
};

function readToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function customerInitials(user: CustomerSessionUser | null) {
  const first = user?.firstName?.trim()?.[0] || "";
  const last = user?.lastName?.trim()?.[0] || "";
  const value = `${first}${last}`.toUpperCase();
  return value || "C";
}

export function useCustomerSession() {
  const [user, setUser] = useState<CustomerSessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = readToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/guest/me", {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        }
        setUser(null);
        return;
      }

      const payload = await response.json() as { guestUser?: CustomerSessionUser | null };
      setUser(payload.guestUser || null);
    } catch {
      // Keep the public website usable even when the account API is temporarily unavailable.
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CUSTOMER_TOKEN_KEY) void refresh();
    };
    const onSessionChanged = () => {
      void refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("calendra:customer-session-changed", onSessionChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("calendra:customer-session-changed", onSessionChanged);
    };
  }, [refresh]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      window.dispatchEvent(new Event("calendra:customer-session-changed"));
    }
    setUser(null);
  }, []);

  return { user, loading, isAuthenticated: Boolean(user), refresh, logout };
}
