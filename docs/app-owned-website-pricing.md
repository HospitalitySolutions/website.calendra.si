# Application-owned website pricing

The application public endpoint `/api/register/public-pricing` is the only production price source. The website does not maintain package, additional-user, SMS or add-on prices.

- Vite obtains and validates the public application catalog before building. The client and SSR builds share that snapshot. A missing/invalid catalog blocks a new build rather than publishing fabricated amounts; the already deployed website is not affected.
- Prerendered prices and structured offers use the same verified snapshot. Visitors refresh the catalog through the existing public API. On refresh failure the last verified application snapshot is retained. Static crawler HTML requires a website rebuild to reflect later app changes.
- The application owns additional-user rates, including zero and tiers, annual prices, annual saving metadata, SMS precision and add-ons. Empty add-ons stay empty.
- Legal terms link to current pricing without repeating monetary amounts. Signed offers and existing contract prices are not modified.
- Psychology team examples derive the package and additional users from the same API and refresh on load. They are not a second price table.
- Numeric sample catalogs live only under `src/test/fixtures` and are resolved only by Vitest. No backend prices, invoices, VAT configuration, permissions or production settings are modified by this change.
- The source API currently exposes `vatIncluded`; tax labels must reflect the actual published app catalog. Ensure the app exposes the correct price/tax basis for the November VAT transition.
