import { APP_BASE_URL } from "@/lib/site";

/** Off unless explicitly enabled: the app endpoint needs its MailerLite group configured first. */
export const isNewsletterSignupEnabled = () => import.meta.env.VITE_NEWSLETTER_SIGNUP_ENABLED === "true";

export type NewsletterSignup = {
  email: string;
  locale: "sl" | "en";
  /** Honeypot value; real visitors never see or fill it. */
  website?: string;
};

export type NewsletterError = "newsletter_invalid" | "newsletter_unavailable";

export const isValidNewsletterEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) && value.trim().length <= 254;

/**
 * Sends the opt-in to the app's validated, rate-limited endpoint, which adds the address to the MailerLite
 * group server-side (the API key never reaches the browser). MailerLite then sends the double opt-in email.
 * Never retries a POST.
 */
export async function subscribeToNewsletter(signup: NewsletterSignup): Promise<void> {
  const csrf = await fetch(`${APP_BASE_URL}/api/auth/csrf`, { credentials: "include", cache: "no-store" }).catch(() => null);
  if (!csrf?.ok) throw new Error("newsletter_unavailable" satisfies NewsletterError);
  const token: unknown = await csrf.json().catch(() => null);
  if (!token || typeof token !== "object" || !("token" in token) || typeof token.token !== "string" || !token.token) {
    throw new Error("newsletter_unavailable" satisfies NewsletterError);
  }
  const response = await fetch(`${APP_BASE_URL}/api/register/newsletter`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": token.token },
    body: JSON.stringify({ email: signup.email.trim(), locale: signup.locale, consent: true, website: signup.website || undefined }),
  }).catch(() => null);
  if (response?.status === 400) throw new Error("newsletter_invalid" satisfies NewsletterError);
  const body: unknown = response?.ok ? await response.json().catch(() => null) : null;
  if (!body || typeof body !== "object" || !("subscribed" in body) || body.subscribed !== true) {
    throw new Error("newsletter_unavailable" satisfies NewsletterError);
  }
}
