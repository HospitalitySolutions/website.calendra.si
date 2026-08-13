import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const caddyfile = await fs.readFile(path.join(root, "Caddyfile"), "utf8");
const failures = [];

const required = [
  "@legacyTenantBookingWithLocation",
  "@legacyTenantBooking",
  "query tenant=* locationId=*",
  "query tenant=*",
  "/narocanje/{http.request.uri.query.tenant}?locationId={http.request.uri.query.locationId}",
  "/narocanje/{http.request.uri.query.tenant} 308",
  "redir /ponudniki /za-stranke 308",
  "redir /en/providers /en/for-customers 308",
  "redir /podjetja /za-stranke 308",
  "redir /en/businesses /en/for-customers 308",
  "redir /stranke /za-stranke 308",
  "redir /en/clients /en/for-customers 308",
  "redir /clients /en/for-customers 308",
];

for (const token of required) {
  if (!caddyfile.includes(token)) failures.push(`missing Caddy SEO redirect token: ${token}`);
}

const routeStart = caddyfile.indexOf("  route {");
const tenantRedirect = caddyfile.indexOf("redir @legacyTenantBooking ");
const genericBookingRedirect = caddyfile.indexOf("redir /booking /en/booking 308");
if (routeStart < 0 || tenantRedirect < routeStart || genericBookingRedirect < tenantRedirect) {
  failures.push("tenant-aware redirects must run before the generic /booking redirect inside the literal route block");
}

if (failures.length) {
  console.error("Caddy SEO redirect test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Verified query-aware legacy booking redirects are present and ordered before generic aliases.");
}
