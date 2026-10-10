// Acquisition values are untrusted URL input. Only known public campaign labels
// may reach a third party; names, search terms and click IDs are never forwarded.
const sources = new Set(["google", "bing", "facebook", "facebook.com", "instagram", "ig", "linkedin", "newsletter", "chatgpt", "chatgpt.com", "perplexity", "perplexity.ai"]);
const media = new Set(["organic", "referral", "social", "organic_social", "paid_social", "cpc", "ppc", "email", "ai-assistant"]);
const campaigns = new Set((import.meta.env.VITE_ANALYTICS_CAMPAIGNS ?? "").split(",").map((v: string) => v.trim()).filter(Boolean));

export const sanitizeAcquisition = (search: string): URLSearchParams => {
  const input = new URLSearchParams(search);
  const output = new URLSearchParams();
  const source = input.get("utm_source")?.toLowerCase();
  const medium = input.get("utm_medium")?.toLowerCase();
  // An incomplete pair is ambiguous and must not manufacture an acquisition.
  if (!source || !medium || !sources.has(source) || !media.has(medium)) return output;
  output.set("utm_source", source);
  output.set("utm_medium", medium);
  const campaign = input.get("utm_campaign");
  if (campaign && campaigns.has(campaign)) output.set("utm_campaign", campaign);
  return output;
};

export const safeReferrer = (referrer: string): string => {
  try {
    const url = new URL(referrer);
    return ["https:", "http:"].includes(url.protocol) ? `${url.origin}/` : "";
  } catch { return ""; }
};
