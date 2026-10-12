// Exercise the actual Caddyfile, including directive sorting and file serving.
// Fixtures include private pages so a bypassed gate cannot pass merely because
// those files happen to be absent from a build. Docker is required.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const image = "caddy:2.10.2-alpine";
const docker = (args) => execFileSync("docker", args, {
  encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 120_000,
}).trim();
const tempRoot = await fs.realpath(os.tmpdir());
const directory = await fs.mkdtemp(path.join(tempRoot, "calendra-website-routing-"));
const fixtures = path.join(directory, "site");
let checks = 0;

try {
  const files = {
    "index.html": "home",
    "narocanje/index.html": "Slovenian booking overview",
    "en/booking/index.html": "English booking overview",
    "en/pricing/index.html": "pricing",
    "za-stranke/index.html": "Slovenian marketplace",
    "en/for-customers/index.html": "English marketplace",
    "za-stranke/existing/index.html": "prerendered profile",
    "_dynamic-location-profile-sl.html": "Slovenian profile shell",
    "_dynamic-location-profile-en.html": "English profile shell",
    "assets/test.js": "export default 1;",
    "fonts/test.woff2": "font fixture",
    "hero/test.webp": "image fixture",
    "robots.txt": "User-agent: *",
  };
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(fixtures, name);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }

  for (const marketplacePublic of [false, true]) {
    let container;
    try {
      container = docker([
        "run", "--rm", "-d", "-p", "127.0.0.1::80",
        "-e", `CUSTOMER_MARKETPLACE_PUBLIC=${marketplacePublic}`,
        "--mount", `type=bind,source=${path.join(root, "Caddyfile")},target=/etc/caddy/Caddyfile,readonly`,
        "--mount", `type=bind,source=${fixtures},target=/srv,readonly`,
        image, "caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile",
      ]);
      const port = docker(["port", container, "80/tcp"]).split(":").at(-1);
      const origin = `http://127.0.0.1:${port}`;
      const get = async (pathname) => {
        const response = await fetch(origin + pathname, { redirect: "manual", signal: AbortSignal.timeout(5_000) });
        return { status: response.status, headers: response.headers, body: await response.text() };
      };
      let ready = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        try { await get("/"); ready = true; break; }
        catch { await new Promise((resolve) => setTimeout(resolve, 100)); }
      }
      assert.ok(ready, "Caddy must start successfully");
      const expect = async (pathname, status, destination) => {
        const response = await get(pathname);
        const context = `${pathname}, marketplacePublic=${marketplacePublic}`;
        assert.equal(response.status, status, context);
        assert.equal(response.headers.get("location"), destination ?? null, context);
        checks++;
        return response;
      };

      for (const pathname of ["/narocanje", "/stranke", "/booking", "/clients", "/en/booking", "/en/clients"]) {
        await expect(`${pathname}?tenant=institut-avisensa`, 308, "/narocanje/institut-avisensa");
        await expect(`${pathname}?tenant=institut-avisensa&locationId=2`, 308, "/narocanje/institut-avisensa?locationId=2");
      }
      for (const slug of ["institut-avisensa", "beauty-lounge"]) {
        await expect(`/en/booking/${slug}`, 308, `/narocanje/${slug}`);
      }
      for (const pathname of ["/ponudniki", "/podjetja", "/stranke"]) {
        await expect(pathname, 308, marketplacePublic ? "/za-stranke" : "/narocanje");
      }
      for (const pathname of ["/en/providers", "/en/businesses", "/en/clients", "/clients"]) {
        await expect(pathname, 308, marketplacePublic ? "/en/for-customers" : "/en/booking");
      }
      for (const [prefix, canonical] of [
        ["/ponudniki", "/za-stranke"], ["/podjetja", "/za-stranke"],
        ["/en/providers", "/en/for-customers"], ["/en/businesses", "/en/for-customers"],
      ]) {
        await expect(`${prefix}/institut-avisensa`, 308, marketplacePublic ? `${canonical}/institut-avisensa` : "/narocanje/institut-avisensa");
        await expect(`${prefix}/beauty-lounge`, 308, `${canonical}/beauty-lounge`);
        // Check the destination too: unpublished profiles must remain 404.
        await expect(`${canonical}/beauty-lounge`, marketplacePublic ? 200 : 404);
      }
      for (const pathname of ["/za-stranke", "/za-stranke/existing", "/en/for-customers"]) {
        await expect(pathname, marketplacePublic ? 200 : 404);
      }
      for (const [alias, destination] of [
        ["/pricing", "/en/pricing"], ["/booking", "/en/booking"],
        ["/support", "/en/support"], ["/security", "/en/security"],
        ["/za-podjetja", "/"], ["/mobilna-aplikacija", "/calendra-connect"],
      ]) await expect(alias, 308, destination);
      for (const pathname of ["/", "/narocanje", "/en/booking"]) {
        const response = await expect(pathname, 200);
        assert.ok(response.headers.get("content-security-policy"), `${pathname}: security headers`);
        assert.equal(response.headers.get("cache-control"), "public, max-age=0, must-revalidate");
        assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /noindex/);
      }
      for (const [pathname, cache] of [
        ["/assets/test.js", "public, max-age=31536000, immutable"],
        ["/fonts/test.woff2", "public, max-age=31536000, immutable"],
        ["/hero/test.webp", "public, max-age=604800"],
        ["/robots.txt", "public, max-age=3600"],
      ]) assert.equal((await expect(pathname, 200)).headers.get("cache-control"), cache);
      await expect("/not-a-real-page", 404);
      console.log(`Caddy HTTP checks passed with marketplace ${marketplacePublic ? "public" : "private"}.`);
    } finally {
      if (container) docker(["stop", container]);
    }
  }
  console.log(`Passed ${checks} HTTP cases: redirects, marketplace gates, public pages, unknown paths and cache/security headers.`);
} finally {
  assert.equal(path.dirname(await fs.realpath(directory)), tempRoot, "Only remove this test's temporary directory");
  assert.ok(path.basename(directory).startsWith("calendra-website-routing-"));
  await fs.rm(directory, { recursive: true, force: true });
}
