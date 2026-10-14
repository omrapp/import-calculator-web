/** Main tools, in the header (and the mobile menu). */
export const primaryNav = [
  { path: '/', titleKey: 'nav.standard' },
  { path: '/air-shipment', titleKey: 'nav.air_shipment' },
  { path: '/history', titleKey: 'nav.history' },
  { path: '/guides', titleKey: 'nav.guides' },
] as const;

/** Site information, in the footer. */
export const footerNav = [
  { path: '/about', titleKey: 'nav.about' },
  { path: '/contact', titleKey: 'nav.contact' },
  { path: '/privacy', titleKey: 'nav.privacy' },
  { path: '/terms', titleKey: 'nav.terms' },
  { path: '/settings', titleKey: 'nav.settings' },
] as const;
