import { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import { withPlausibleProxy } from "next-plausible";

const STUDIO_REWRITE = {
  source: "/studio/:path*",
  destination:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:3333/studio/:path*"
      : "/studio/index.html",
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  rewrites: async () => [STUDIO_REWRITE],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  experimental: {
    optimizePackageImports: ["react-feather"],
    inlineCss: true,
  },
  turbopack: {},
  compiler: {
    styledComponents: true,
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              // Control who can embed your pages
              "frame-ancestors 'self'",
              // Control which frames you can embed
              "frame-src * swish:",
              // Control which scripts can execute
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
                "https://*.googletagmanager.com " +
                "https://*.google-analytics.com " +
                "https://*.hotjar.com " +
                "https://script.hotjar.com " +
                "https://*.ads-twitter.com " +
                "https://*.facebook.net " +
                "https://connect.facebook.net " +
                "https://www.youtube.com",
              // Prevent plugin injection
              "object-src 'none'",
              // Allow for workers to be loaded from self
              "worker-src 'self' blob:",
            ].join("; "),
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
        has: [
          {
            type: "host",
            value: "gieffektivt.no",
          },
        ],
        destination: "/ofte-stilte-sporsmal",
        permanent: true,
      },
      {
        source: "/faq",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        destination: "/vanliga-fragor",
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
        has: [
          {
            type: "host",
            value: "gieffektivt.no",
          },
        ],
        destination: "/artikler",
        permanent: true,
      },
      {
        source: "/blogg",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        destination: "/artiklar",
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
      {
        source: "/blogg/skanka-pengar-i-kris",
        destination: "/artiklar/kriser-media-och-viljan-att-hjaelpa",
        permanent: true,
      },
      {
        source: "/blogg/skanka-till-jordbavningen-i-turkiet",
        destination: "/artiklar/kriser-media-och-viljan-att-hjaelpa",
        permanent: true,
      },
      {
        source: "/blogg/donera-till-ukraina",
        destination: "/artiklar/kriser-media-och-viljan-att-hjaelpa",
        permanent: true,
      },
      {
        source: "/tre-anledningar-till-varfor-vi-bor-donera-pengar-till-valgorenhet",
        destination: "/artiklar/tre-anledningar-till-att-ge",
        permanent: true,
      },
      {
        source: "/blogg/arbete-eller-tur",
        destination: "/artiklar/arbete-eller-tur",
        permanent: true,
      },
      {
        source: "/globalojamlikhet",
        destination: "/artiklar/global-ojamlikhet",
        permanent: true,
      },
      {
        source: "/blogg/prm_arvid_norin",
        destination: "/artiklar/arvid-ger-mer-aen-halva-loenen-till-klimatet",
        permanent: true,
      },
      {
        source: "/kan-lycka-kpas-for-pengar",
        destination: "/artiklar/kan-lycka-kopas-for-pengar",
        permanent: true,
      },
      {
        source: "/blogg/vilka-organisationer-samlar-in-mest-pengar",
        destination: "/artiklar/vilka-organisationer-samlar-in-mest-pengar",
        permanent: true,
      },
      {
        source: "/vilkor",
        destination: "/integritetspolicy",
        permanent: true,
      },
      {
        source: "/organisationer",
        destination: "/rekommenderade-organisationer",
        permanent: false,
      },
      {
        source: "/en",
        destination: "/",
        permanent: false,
      },
      { source: "/organisationer/faunalytics", destination: "/djurvalfard", permanent: true },
      {
        source: "/organisationer/wild-animal-initiative",
        destination: "/djurvalfard",
        permanent: true,
      },
      { source: "/organisationer/the-humane-league", destination: "/djurvalfard", permanent: true },
      {
        source: "/organisationer/djurvalfard/good-food-institute",
        destination: "/djurvalfard",
        permanent: true,
      },
      {
        source: "/organisationer/ace-recommended-charity-fund",
        destination: "/klimat",
        permanent: true,
      },
      { source: "/organisationer/clean-air-task-force", destination: "/klimat", permanent: true },
      {
        source: "/organisationer/klimat/good-food-institute",
        destination: "/klimat",
        permanent: true,
      },
      {
        source: "/organisationer/evergreen-collaborative",
        destination: "/klimat",
        permanent: true,
      },
      { source: "/organisationer/good-energy-collective", destination: "/klimat", permanent: true },
      { source: "/organisationer/industrious-labs", destination: "/klimat", permanent: true },
      {
        source: "/organisationer/founders-pledge-climate-change-fund",
        destination: "/klimat",
        permanent: true,
      },
      { source: "/metod", destination: "/var-metod", permanent: true },
      { source: "/varfr-ge-effektivt", destination: "/", permanent: true },
      { source: "/organisationer#global-halsa", destination: "/global-halsa", permanent: true },
      {
        source: "/organisationer/against-malaria-foundation",
        destination: "/global-halsa",
        permanent: true,
      },
      {
        source: "/organisationer/malaria-consortium",
        destination: "/global-halsa",
        permanent: true,
      },
      {
        source: "/organisationer/helen-keller-international",
        destination: "/global-halsa",
        permanent: true,
      },
      {
        source: "/organisationer/top-charities-all-grants-fund",
        destination: "/global-halsa",
        permanent: true,
      },
      { source: "/organisationer/new-incentives", destination: "/global-halsa", permanent: true },
      { source: "/organisationer#djurvalfard", destination: "/djurvalfard", permanent: true },
      { source: "/organisationer#klimat", destination: "/klimat", permanent: true },
      { source: "/ge", destination: "/", permanent: true },
      {
        source: "/filantropi",
        destination: "/filantropisk-radgivning",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        permanent: true,
      },
      { source: "/jobba-hos-oss", destination: "/lediga-jobb", permanent: true },
      { source: "/om", destination: "/om-oss", permanent: true },
      {
        source: "/vi-behoever-prata-om-administrationskostnaderna",
        destination: "/artiklar/vi-maste-prata-om-administrationskostnaderna",
        permanent: true,
      },
      {
        source: "/arsrapport-2021",
        destination: "/arsrapporter",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        permanent: false,
      },
      {
        source: "/arsrapport-2022",
        destination: "/arsrapporter",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        permanent: false,
      },
      {
        source: "/globalhalsa",
        destination: "/global-halsa",
        has: [
          {
            type: "host",
            value: "geeffektivt.se",
          },
        ],
        permanent: true,
      },
      {
        source: "/globalhälsa",
        destination: "/global-halsa",
        has: [
          {
            type: "host",
            value: "geeffektivt.no",
          },
        ],
        permanent: true,
      },
      {
        source: "/global-hälsa",
        destination: "/global-halsa",
        has: [
          {
            type: "host",
            value: "geeffektivt.no",
          },
        ],
        permanent: true,
      },
      {
        source: "/andreas-wahls-arlige-juleinnsamling-for-effektiv-bistand-2024",
        destination: "/wahl",
        has: [
          {
            type: "host",
            value: "gieffektivt.no",
          },
        ],
        permanent: true,
      },
      {
        source: "/andreas-wahls-arlige-juleinnsamling-for-effektiv-bistand",
        destination: "/wahl",
        has: [
          {
            type: "host",
            value: "gieffektivt.no",
          },
        ],
        permanent: true,
      },
    ];
  },
};

module.exports = (phase: any, defaultConfig: NextConfig) => {
  return withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
  })(withPlausibleProxy()(nextConfig));
};
