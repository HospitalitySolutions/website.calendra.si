# Application-owned website pricing

The application public endpoint `/api/register/public-pricing` is the only production price source. The website does not maintain package, additional-user, SMS or add-on prices.

- Vite obtains and validates the public application catalog before building. The client and SSR builds share that snapshot. A missing/invalid catalog blocks a new build rather than publishing fabricated amounts; the already deployed website is not affected.
- Prerendered prices and structured offers use the same verified snapshot. Visitors refresh the catalog through the existing public API. On refresh failure the last verified application snapshot is retained. Static crawler HTML requires a website rebuild to reflect later app changes.
- The application owns additional-user rates, including zero and tiers, annual prices, annual saving metadata, SMS precision and add-ons. Empty add-ons stay empty.
- Legal terms link to current pricing without repeating monetary amounts. Signed offers and existing contract prices are not modified.
- Psychology team examples derive the package and additional users from the same API and refresh on load. They are not a second price table.
- Numeric sample catalogs live only under `src/test/fixtures` and are resolved only by Vitest. No backend prices, invoices, VAT configuration, permissions or production settings are modified by this change.
- From 1 November 2026 the owner confirms that the published numeric rates are net, with 22% VAT added (SI10550631). The website preserves every app-provided amount and applies this tax basis in `pricing-tax.ts`. The legacy API still reports `vatIncluded: true` and uses `*Gross` names; normalization explicitly overrides that obsolete flag so a live refresh cannot revert the approved wording or structured data. This is a public quotation/display transition, not an invoice migration.
- Monthly quotes show net subtotal, rounded VAT and gross total. Annual quotes use the app's exact annual plan amount plus recurring users/modules for `annualBilledMonths`, with VAT calculated on the annual subtotal. SMS remain a separate monthly usage estimate; annual totals are never derived by multiplying rounded monthly equivalents.
- Registration links carry selected quantities and an explicitly labeled tax estimate. The app remains responsible for its payable invoices. Existing signed prices, paid periods and invoice calculations are unchanged by this website release; the app billing transition must be coordinated separately.
