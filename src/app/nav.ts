/** Header navigation: the three things people come here to do. */
export const headerNav = [
  {
    path: '/',
    titleKey: 'nav.calculator',
    // The calculator group: both modes and their result.
    activeOn: ['/', '/air-shipment', '/result'],
  },
  { path: '/history', titleKey: 'nav.history', activeOn: ['/history'] },
  { path: '/guides', titleKey: 'nav.guides_short', activeOn: ['/guides'] },
] as const;

/** Every tool, by name (footer "Tools" column and the mobile menu). */
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
