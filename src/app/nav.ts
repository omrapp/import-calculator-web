/** Header navigation: the things people come here to do. */
export const headerNav = [
  { path: '/', titleKey: 'nav.home_link', activeOn: ['/'] },
  {
    path: '/calculator',
    titleKey: 'nav.calculator',
    // The calculator group: both modes and their result.
    activeOn: ['/calculator', '/air-shipment', '/result'],
  },
  { path: '/history', titleKey: 'nav.history', activeOn: ['/history'] },
  { path: '/guides', titleKey: 'nav.guides_short', activeOn: ['/guides'] },
  {
    path: '/examples',
    titleKey: 'nav.examples_short',
    activeOn: ['/examples'],
  },
  { path: '/websites', titleKey: 'nav.websites', activeOn: ['/websites'] },
] as const;

/** Every tool, by name (footer "Tools" column and the mobile menu). */
export const primaryNav = [
  { path: '/', titleKey: 'nav.home_link' },
  { path: '/calculator', titleKey: 'nav.standard' },
  { path: '/air-shipment', titleKey: 'nav.air_shipment' },
  { path: '/history', titleKey: 'nav.history' },
  { path: '/guides', titleKey: 'nav.guides' },
  { path: '/examples', titleKey: 'nav.examples' },
  { path: '/websites', titleKey: 'nav.websites' },
] as const;

/** Site information, in the footer. */
export const footerNav = [
  { path: '/about', titleKey: 'nav.about' },
  { path: '/contact', titleKey: 'nav.contact' },
  { path: '/privacy', titleKey: 'nav.privacy' },
  { path: '/terms', titleKey: 'nav.terms' },
  { path: '/settings', titleKey: 'nav.settings' },
] as const;
