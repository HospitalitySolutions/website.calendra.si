export const LEGAL = {
  entityName: 'Hospit, David Mirc s.p.',
  businessAddress: 'Cesta Toneta Tomšiča 78a',
  country: 'Slovenia',
  generalEmail: 'dmirc@hosp-it.eu',
  privacyEmail: 'dmirc@hosp-it.eu',
  supportEmail: 'dmirc@hosp-it.eu',
  websiteAndAppSameEntity: true,
  audience: 'B2B',
  governingLaw: 'Republic of Slovenia',
  processors: ['Amazon Web Services (AWS)'],
} as const;

export const LEGAL_FULL_ADDRESS = `${LEGAL.businessAddress}, ${LEGAL.country}`;
