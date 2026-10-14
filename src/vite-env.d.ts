/** package.json version, injected by Vite `define`. */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** Deploy origin for canonical, hreflang and sitemap URLs. */
  readonly VITE_SITE_URL?: string;
}
