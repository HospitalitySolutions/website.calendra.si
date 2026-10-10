import { APP_BASE_URL } from "@/lib/site";

export type Inquiry = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: "sl" | "en";
  plan?: "basic" | "pro" | "business";
  billing?: "monthly" | "annual";
};

/** Uses the app's validated, rate-limited email endpoint. Never retries a POST. */
export async function sendInquiry(inquiry: Inquiry): Promise<void> {
  const csrf = await fetch(`${APP_BASE_URL}/api/auth/csrf`, { credentials: "include", cache: "no-store" });
  if (!csrf.ok) throw new Error("inquiry_unavailable");
  const token: unknown = await csrf.json();
  if (!token || typeof token !== "object" || !("token" in token) || typeof token.token !== "string" || !token.token) {
    throw new Error("inquiry_unavailable");
  }
  const response = await fetch(`${APP_BASE_URL}/api/register/contact`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": token.token },
    body: JSON.stringify(inquiry),
  });
  if (!response.ok || (await response.json())?.sent !== true) throw new Error("inquiry_not_sent");
}
