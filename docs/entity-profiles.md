# Off-site entity profiles

Search engines and AI assistants build their picture of who Calendra is from
sources beyond this website. Where those sources disagree, the entity is treated
as ambiguous and none of them is trusted. This file is the single reference for
what to enter on every external profile.

The name, address and phone number below are the ones emitted in the
`Organization` JSON-LD from `src/lib/seo.ts`, which reads them from
`src/lib/legal.ts`. `src/test/entity-profiles.test.ts` fails the build if this
file and that data ever disagree, so edit `src/lib/legal.ts` first and update
this file to match, never the other way around.

## Canonical NAP

Use these strings verbatim. Do not abbreviate, reorder or translate them.

<!-- NAP_START -->
- Name: Calendra
- Legal entity: Hospit, David Mirc s.p.
- Street: Cesta Toneta Tomšiča 78a
- Postal code and city: 4270 Jesenice
- Country: Slovenia
- Phone: (+386) 40 641 644
- Email: info@calendra.si
- Website: https://calendra.si
<!-- NAP_END -->

## Supporting copy

Short description, under 160 characters, for profiles with a tagline field:

> Calendra is a Slovenian platform for service businesses: online booking,
> appointment calendar, reminders, client management and invoicing in one place.

Slovenian version:

> Calendra je slovenska platforma za storitvena podjetja: spletno naročanje,
> koledar terminov, opomniki, upravljanje strank in izdaja računov na enem mestu.

Category, where a profile asks for one: appointment scheduling software /
booking software / SaaS for service businesses.

Logo: `https://calendra.si/calendra-logo.png` (512x512, PNG).

## Where to list, in priority order

Work down this list. After each profile goes live, add its public URL to
`VITE_ENTITY_PROFILE_URLS` in the deployment `.env` and rebuild, so the URL is
emitted as a `sameAs` entry and the link between the profile and this site is
declared from both ends.

| Priority | Profile | Why it matters | Notes |
| --- | --- | --- | --- |
| 1 | Google Business Profile | Local pack visibility and the Google knowledge panel | Already claimed; keep hours, category and photos current |
| 2 | Wikidata | The identifier most knowledge graphs and AI assistants reconcile against | Needs independent sources to survive notability review; attempt after press or directory coverage exists. Set `VITE_WIKIDATA_ENTITY_ID` once the item exists |
| 3 | bizi.si | Primary Slovenian business register directory | Verify the entry matches the legal entity name exactly |
| 4 | PIRS | Slovenian business directory | Same NAP, Slovenian description |
| 5 | Capterra | Software review site cited heavily in buyer research and AI answers | Requires a vendor account and product listing |
| 6 | G2 | Same as Capterra, with a different audience | Listings gain weight only with real reviews; ask existing customers |
| 7 | Crunchbase | Company entity record used widely as a machine-readable source | Free profile is enough |
| 8 | Product Hunt | Launch visibility plus a durable product page | One-off launch, permanent listing |
| 9 | LinkedIn company page | Already live; keep the website URL and description aligned | |
| 10 | AlternativeTo / SaaSHub | Long-tail "alternative to X" queries that pair with the comparison pages | |

## Rules that matter more than the list

1. **Never vary the NAP.** "Calendra" and "Calendra d.o.o." are two entities.
   So are "Cesta Toneta Tomšiča 78a" and "Cesta Toneta Tomsica 78a".
2. **Always link back to `https://calendra.si`**, without a trailing path or
   tracking parameters.
3. **Add the profile URL to `VITE_ENTITY_PROFILE_URLS` after it goes live.** A
   `sameAs` pointing at a profile that does not link back is a weaker signal
   than a reciprocal pair.
4. **Do not buy directory listings in bulk.** Low-quality link directories are
   the pattern that gets discounted; ten accurate profiles beat two hundred.
5. **Reviews cannot be incentivised.** Both G2 and Capterra remove listings for
   it, and a removed listing is worse than no listing.

## Registration identifiers

Once available, set `VITE_COMPANY_VAT_ID` and
`VITE_COMPANY_REGISTRATION_NUMBER` in the deployment `.env`. They are emitted in
`Organization` schema as `vatID` and an AJPES `identifier`, which is the
strongest available proof that the directory entry and this website describe the
same legal person. They are omitted entirely when unset, so an empty value is
safe.
