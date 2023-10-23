const { withPlausibleProxy } = require("next-plausible");

const STUDIO_REWRITE = {
  source: "/studio/:path*",
  destination:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3333/studio/:path*"
      : "/studio/index.html",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: () => [STUDIO_REWRITE],
  images: {
    domains: ["cdn.sanity.io"],
  },
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://gieffektivt.adoveo.com/",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/organisasjoner",
        destination: "/topplista",
        permanent: true,
      },
      {
        source: "/organizations",
        destination: "/topplista",
        permanent: true,
      },
      {
        source: "/metode",
        destination: "/kriterier",
        permanent: true,
      },
      {
        source: "/criteria",
        destination: "/kriterier",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/om-oss",
        permanent: true,
      },
      {
        source: "/support",
        destination: "/ofte-stilte-sporsmal",
        permanent: true,
      },
      {
        source: "/faq",
        destination: "/ofte-stilte-sporsmal",
        permanent: true,
      },
      {
        source: "/historikk",
        destination: "/full-oversikt",
        permanent: true,
      },
      {
        source: "/samarbeid-drift",
        destination: "/vilkar",
        permanent: true,
      },
      {
        source: "/vilkaar",
        destination: "/vilkar",
        permanent: true,
      },
      {
        source: "/media",
        destination: "/medieomtale",
        permanent: true,
      },
      {
        source: "/blogg",
        destination: "/artikler",
        permanent: true,
      },
      {
        source: "/articles",
        destination: "/artikler",
        permanent: true,
      },
      {
        source: "/articles/:slug*",
        destination: "/artikler/:slug*",
        permanent: true,
      },
      {
        source: "/tpost/1n55miadvz-hvorfor-sttter-gieffektivtno-et-borgerln",
        destination: "/artikler/borgerlonn-pa-1-2-3",
        permanent: true,
      },
      {
        source: "/tpost/pjiz7x2cj9-endringer-i-anbefalte-organisasjoner",
        destination: "/artikler/endringer-i-anbefalte-organisasjoner",
        permanent: true,
      },
      {
        source: "/tpost/npn2ntbo11-vi-m-snakke-om-administrasjonskostnader",
        destination: "/artikler/vi-ma-snakke-om-administrasjonskostnader",
        permanent: true,
      }, //
      {
        source: "/tpost/npn2ntbo11-vi-m-snakke-om-administrasjonskostnader",
        destination: "/artikler/vi-ma-snakke-om-administrasjonskostnader",
        permanent: true,
      },
      {
        source: "/tpost/ptdkrf7g8z-gi-effektivt",
        destination: "/artikler/aa-gi-effektivt",
        permanent: true,
      },
      {
        source: "/tpost/xtuztcld41-kronikk-i-morgenbladet-er-det-tanken-som",
        destination: "/artikler/er-det-tanken-som-teller",
        permanent: true,
      },
      {
        source: "/tpost/e9mef30mt1-worm-wars-hvorfor-mass-deworming-nr-fors",
        destination: "/artikler/worm-wars",
        permanent: true,
      },
      {
        source: "/tpost/h6pxrfxhy0-hvorfor-gi",
        destination: "/artikler/hvorfor-gi",
        permanent: true,
      },
      {
        source: "/tpost/j0k6mi1no1-kronikk-i-bistandsaktuelt-frp-forstr-ikk",
        destination: "/artikler/frp-forstar-ikke-effektivitet",
        permanent: true,
      },
      {
        source: "/bistandsmyter",
        destination: "/kommer-snart",
        permanent: true,
      },
      {
        source: "/hvor-rik-er-jeg",
        destination: "/kommer-snart",
        permanent: true,
      },
      {
        source: "/fb-skattefradrag",
        destination: "/skattefradrag",
        permanent: true,
      },
      {
        source: "/gi",
        destination: "/",
        permanent: true,
      },
      {
        source: "/scorecard",
        destination:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6Wiw_6vcspIHq6J2byvqmlDFadG5sF4cFQvwhm2z21ZYbfBW0tQknixlu2hV6lDi_TV16iwUYcJ3W/pubhtml?gid=880180721&single=true",
        permanent: false,
      },
      {
        source: "/resultater",
        destination:
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vS6Wiw_6vcspIHq6J2byvqmlDFadG5sF4cFQvwhm2z21ZYbfBW0tQknixlu2hV6lDi_TV16iwUYcJ3W/pubhtml?gid=880180721&single=true",
        permanent: false,
      },
      {
        source: "/aarsrapport",
        destination: "https://gieffektivt.no/arsrapporter",
        permanent: false,
      },
      {
        source: "/onepager",
        destination:
          "https://drive.google.com/file/d/18qWoVYVhFpDilNssxbXfBQY_snSCxFkV/view?usp=sharing",
        permanent: true,
      },
      {
        source: "/givewell-maximum-impact-fund",
        destination: "/givewell-top-charities-fund",
        permanent: true,
      },
      {
        source: "/vippsagreement",
        destination: "/vippsavtale",
        permanent: true,
      },
      {
        source: "/profile",
        destination: "/min-side",
        permanent: true,
      },
      {
        source: "/profile/tax",
        destination: "/min-side/skatt",
        permanent: true,
      },
      {
        source: "/profile/details",
        destination: "/min-side/profil",
        permanent: true,
      },
      {
        source: "/profile/agreements",
        destination: "/min-side/avtaler",
        permanent: true,
      },
    ];
  },
};

module.exports = withPlausibleProxy()(nextConfig);
