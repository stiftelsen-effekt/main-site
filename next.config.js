const { withSentryConfig } = require("@sentry/nextjs");

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
  sentry: {
    // Use `hidden-source-map` rather than `source-map` as the Webpack `devtool`
    // for client-side builds. (This will be the default starting in
    // `@sentry/nextjs` version 8.0.0.) See
    // https://webpack.js.org/configuration/devtool/ and
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/#use-hidden-source-map
    // for more information.
    hideSourceMaps: true,
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
        destination: "/om",
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
        source: "/aarsrapport21",
        destination: "https://stiftelseneffekt.no/aarsrapport21",
        permanent: true,
      },
      {
        source: "/aarsrapport20",
        destination: "https://stiftelseneffekt.no/aarsrapport20",
        permanent: true,
      },
      {
        source: "/aarsrapport19",
        destination: "https://stiftelseneffekt.no/aarsrapport19",
        permanent: true,
      },
      {
        source: "/aarsrapport18",
        destination: "https://stiftelseneffekt.no/aarsrapport18",
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
        destination: "https://stiftelseneffekt.no/aarsrapport21",
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

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
