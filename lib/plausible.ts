// Site-specific Plausible (script v2) URLs, from each site's Plausible dashboard
// under Site settings → Site installation. They are public: the script ships in
// the page. Outbound links, tagged events and revenue tracking are enabled per
// site in that same dashboard rather than in code.
const PLAUSIBLE_SCRIPTS: Record<string, string> = {
  "gieffektivt.no": "https://plausible.io/js/pa-Ba10q-8ik-TZwkxQmNUFE.js",
  "geeffektivt.se": "https://plausible.io/js/pa-VLSeZzFiyFX17Sd4Yaquq.js",
  "giveffektivt.dk": "https://plausible.io/js/pa-bRMnJGGIvu8hitcYbxPel.js",
};

const normalizeDomain = (domain: string) =>
  domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");

/**
 * Resolves the Plausible script URL for the site being built, based on
 * NEXT_PUBLIC_PLAUSIBLE_DOMAIN (set per Vercel project). Throws on an unknown
 * domain so a misconfigured project fails its build instead of silently
 * reporting to another site's dashboard.
 */
export const getPlausibleScriptSrc = (
  domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || "gieffektivt.no",
) => {
  const src = PLAUSIBLE_SCRIPTS[normalizeDomain(domain)];
  if (!src) {
    throw new Error(
      `No Plausible script configured for NEXT_PUBLIC_PLAUSIBLE_DOMAIN="${domain}". ` +
        `Add it to lib/plausible.ts.`,
    );
  }
  return src;
};

// Keep v3's proxy paths: middleware.page.ts skips /js/ and /proxy/, and this
// keeps the event endpoint out of our own pages/api namespace.
export const PLAUSIBLE_PROXY_PATHS = {
  scriptPath: "/js/script.js",
  apiPath: "/proxy/api/event",
};
