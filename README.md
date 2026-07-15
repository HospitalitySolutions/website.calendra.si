# Calendra website

V tem projektu je pripravljena produkcijska Docker postavitev za statično React/Vite spletno stran.

## Kaj je vključeno

- nova stran politike zasebnosti na `/privacy-policy` in `/zasebnost`
- Docker build za produkcijo
- container za website, ki teče na internem portu `80`, na hostu pa privzeto na `8080`
- priprava za uporabo za obstoječim reverse proxy-jem, ki že uporablja porta `80` in `443`
- `docker-compose.yml` za hiter zagon na EC2

## Zakaj je port spremenjen

Ker na istem EC2 že teče `app.calendra.si` na portih `80` in `443`, website container ne sme več direktno vezati teh portov.
Ta paket zato privzeto objavi website na:

- `http://SERVER_IP:8080`

Nato v obstoječem reverse proxy-ju dodate host-based preusmeritev za:

- `calendra.si`
- `www.calendra.si`

proti:

- `http://127.0.0.1:8080`

## Namestitev na EC2

Predpogoji:

- DNS zapis `A` za `calendra.si` naj kaže na `18.198.130.87`
- po potrebi tudi `www.calendra.si`
- port `8080` naj bo dostopen lokalno na strežniku
- nameščena Docker in Docker Compose Plugin

### Zagon

```bash
cd ~/calendra-website
docker compose up -d --build
```

Website bo po zagonu dosegljiv na `http://127.0.0.1:8080`.

## Če želite drug host port

Privzeti host port je `8080`. Spremenite ga lahko tako:

```bash
WEBSITE_PORT=8081 docker compose up -d --build
```

## Reverse proxy primeri

### Nginx

```nginx
server {
    listen 80;
    server_name calendra.si www.calendra.si;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Če Nginx že terminira TLS, dodajte tudi ustrezen `server` blok za `443` oziroma certifikat v obstoječo konfiguracijo.

### Caddy

```caddy
calendra.si, www.calendra.si {
    reverse_proxy 127.0.0.1:8080
}
```

To dodajte v obstoječi Caddy, ki že streže `app.calendra.si`.

## Prilagoditev povezav za aplikacijo

CTA gumba za prijavo in registracijo privzeto kažeta na `https://app.calendra.si`.
Če želite drugo ciljno aplikacijo, ob build-u nastavite `VITE_APP_BASE_URL`.

Primer:

```bash
VITE_APP_BASE_URL=https://app.calendra.si docker compose up -d --build
```

## Posodobitev po spremembah

```bash
cd ~/calendra-website
docker compose down
docker compose up -d --build
```

## Pregled logov

```bash
docker compose logs -f
```

## Pomembno pred objavo

Na strani politike zasebnosti dopolnite:

- uradni naziv upravljavca, če ni enak blagovni znamki Calendra
- kontaktni naslov za vprašanja glede zasebnosti
- dejansko uporabljene piškotke in zunanje ponudnike, če jih uporabljate


## Legal details

Business and legal details for the website are centralized in `src/lib/legal.ts`.
Update that file if contact or entity information changes.

## SEO deployment notes

This build includes the immediate SEO foundation plus route prerendering:

- Route-specific titles and meta descriptions are defined in `src/lib/seo.ts`.
- `npm run build` now builds the client, builds a temporary SSR bundle, then runs `scripts/prerender.mjs`.
- `scripts/prerender.mjs` creates real static HTML files for each canonical route, including route-specific `<title>`, meta description, canonical, hreflang, Open Graph, Twitter tags, JSON-LD structured data, and rendered body content.
- `src/components/seo/SeoManager.tsx` remains in place so metadata is still updated during client-side navigation after hydration.
- Canonical Slovenian URLs and `/en/*` English URLs are defined in `src/lib/localized-routes.ts`.
- Legacy English aliases redirect to their canonical `/en/*` versions in `Caddyfile`.
- Caddy serves any file-backed prerendered route with `{path}/index.html`; there is no separate canonical-route whitelist that can drift out of sync. Unknown routes still return HTTP 404.
- `scripts/prerender.mjs` generates `dist/sitemap.xml` from the same canonical route registry used for prerendering, excludes `noindex` pages, and adds reciprocal Slovenian/English hreflang alternates.
- Sitemap `lastmod` values are controlled in `src/lib/localized-routes.ts` and should be set only after meaningful page changes.
- Run `npm run test:seo` to build the website, request every generated sitemap URL, verify HTTP 200, and confirm an unknown route returns HTTP 404.
- `public/robots.txt` references the sitemap and excludes noindex account-deletion URLs.
- `public/og-calendra.png` replaces the old Lovable Open Graph image.
- Unknown production routes now return HTTP 404 in Caddy instead of serving the SPA with a soft-404 response.

### Google Search Console

After deployment:

1. Open Google Search Console.
2. Add or select the `calendra.si` domain property.
3. Verify the property, preferably with DNS verification.
4. Submit this sitemap: `https://calendra.si/sitemap.xml`.
5. Use URL Inspection for the most important pages: `/`, `/cenik`, `/narocanje`, `/stranke`, `/en`, `/en/pricing`.

Search Console verification and sitemap submission require access to the Google account/property and cannot be completed from this repository alone.


### Official profiles in structured data

The verified Google Business profile is included automatically. Add the final official social and app-store URLs as Docker build environment variables so `Organization.sameAs` contains only real public profiles:

```bash
VITE_LINKEDIN_URL=https://www.linkedin.com/company/... \
VITE_YOUTUBE_URL=https://www.youtube.com/@... \
VITE_GOOGLE_PLAY_URL=https://play.google.com/store/apps/details?id=... \
VITE_APP_STORE_URL=https://apps.apple.com/app/id... \
docker compose up -d --build
```

Empty or invalid values are omitted from structured data.
