export const LEGAL = {
  entityName: 'Hospit, David Mirc s.p.',
  businessAddress: 'Cesta Toneta Tomšiča 78a',
  country: 'Slovenia',
  generalEmail: 'dmirc@hosp-it.eu',
  privacyEmail: 'dmirc@hosp-it.eu',
  supportEmail: 'dmirc@hosp-it.eu',
  supportPhone: '(+386) 40 641 644',
  supportPhoneTel: '+38640641644',
  websiteAndAppSameEntity: true,
  audience: 'B2B',
  governingLaw: 'Republic of Slovenia',
  processors: ['Amazon Web Services (AWS)'],
} as const;

export const LEGAL_FULL_ADDRESS = `${LEGAL.businessAddress}, ${LEGAL.country}`;
