# Calendra website

V tem projektu je pripravljena produkcijska Docker postavitev za statično React/Vite spletno stran.

## Kaj je vključeno

- nova stran politike zasebnosti na `/privacy-policy` in `/zasebnost`
- Docker build za produkcijo
- Caddy konfiguracija za `calendra.si`, `www.calendra.si` in začetni HTTP dostop prek `18.198.130.87`
- `docker-compose.yml` za hiter zagon na EC2

## Namestitev na EC2

Predpogoji:

- DNS zapis `A` za `calendra.si` naj kaže na `18.198.130.87`
- po potrebi tudi `www.calendra.si`
- odprta porta `80` in `443` v Security Group / firewallu
- nameščena Docker in Docker Compose Plugin

### Zagon

```bash
cd ~/calendra-website
docker compose build
docker compose up -d
```

### Posodobitev po spremembah

```bash
cd ~/calendra-website
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Pregled logov

```bash
docker compose logs -f
```

## Prilagoditev povezav za aplikacijo

CTA gumba za prijavo in registracijo privzeto kažeta na `https://staging.calendra.si`.
Če želite drugo ciljno aplikacijo, ob build-u nastavite `VITE_APP_BASE_URL`.

Primer:

```bash
docker compose build --build-arg VITE_APP_BASE_URL=https://app.calendra.si
```

## Pomembno pred objavo

Na strani politike zasebnosti dopolnite:

- uradni naziv upravljavca, če ni enak blagovni znamki Calendra
- kontaktni naslov za vprašanja glede zasebnosti
- dejansko uporabljene piškotke in zunanje ponudnike, če jih uporabljate
