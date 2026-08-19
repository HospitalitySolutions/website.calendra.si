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
  "@legacyEnBookingPath path_regexp legacyEnBookingPath ^/en/booking/([^/]+)$",
  "redir @legacyEnBookingPath /narocanje/{re.legacyEnBookingPath.1} 308",
  "@privateLegacySlDirectory",
  "path /ponudniki /podjetja /stranke",
  "redir @privateLegacySlDirectory /narocanje 308",
  "@privateLegacyEnDirectory",
  "path /en/providers /en/businesses /en/clients /clients",
  "redir @privateLegacyEnDirectory /en/booking 308",
  "@legacyAvisensaProfile {",
  "path /ponudniki/institut-avisensa /podjetja/institut-avisensa /en/providers/institut-avisensa /en/businesses/institut-avisensa",
  "redir @legacyAvisensaProfile /narocanje/institut-avisensa 308",
  "redir /ponudniki /za-stranke 308",
  "redir /en/providers /en/for-customers 308",
  "redir /podjetja /za-stranke 308",
  "redir /en/businesses /en/for-customers 308",
  "redir /stranke /za-stranke 308",
  "redir /en/clients /en/for-customers 308",
  "redir /clients /en/for-customers 308",
  "redir @legacySlProviderProfile /za-stranke/{re.legacySlProviderProfile.1} 308",
  "redir @legacyEnProviderProfile /en/for-customers/{re.legacyEnProviderProfile.1} 308",
  "@slCustomerProfile path /za-stranke/*",
  "try_files {path}/index.html /_dynamic-location-profile-sl.html",
  "@enCustomerProfile path /en/for-customers/*",
  "try_files {path}/index.html /_dynamic-location-profile-en.html",
];

for (const token of required) {
  if (!caddyfile.includes(token)) failures.push(`missing Caddy SEO redirect token: ${token}`);
}

const routeStart = caddyfile.indexOf("  route {");
const tenantRedirect = caddyfile.indexOf("redir @legacyTenantBooking ");
const pathBookingRedirect = caddyfile.indexOf("redir @legacyEnBookingPath ");
const privateDirectoryRedirect = caddyfile.indexOf("redir @privateLegacyEnDirectory ");
const publicDirectoryRedirect = caddyfile.indexOf("redir /en/businesses /en/for-customers 308");
const genericBookingRedirect = caddyfile.indexOf("redir /booking /en/booking 308");
if (routeStart < 0 || tenantRedirect < routeStart || pathBookingRedirect < tenantRedirect || genericBookingRedirect < pathBookingRedirect) {
  failures.push("legacy tenant/path booking redirects must run before the generic /booking redirect inside the literal route block");
}
if (privateDirectoryRedirect < routeStart || publicDirectoryRedirect < privateDirectoryRedirect) {
  failures.push("private-marketplace directory fallbacks must run before redirects to the public marketplace");
}

if (failures.length) {
  console.error("Caddy SEO redirect test failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("Verified legacy booking redirects and private-marketplace directory fallbacks are present and correctly ordered.");
}
