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
