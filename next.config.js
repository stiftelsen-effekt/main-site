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
  async redirects() {
    return [
      {
        source: '/organisasjoner',
        destination: '/organizations',
        permanent: true,
      },
      {
        source: '/metode',
        destination: '/criteria',
        permanent: true,
      },
      {
        source: '/om',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/faq',
        destination: '/support',
        permanent: true,
      },
      {
        source: '/historikk',
        destination: '/full-oversikt',
        permanent: true,
      },
      {
        source: '/samarbeid-drift',
        destination: '/vilkar',
        permanent: true,
      },
      {
        source: '/vilkaar',
        destination: '/vilkar',
        permanent: true,
      },
      {
        source: '/media',
        destination: '/medieomtale',
        permanent: true,
      },
      {
        source: '/blogg',
        destination: '/articles',
        permanent: true,
      },
      {
        source: '/tpost/1n55miadvz-hvorfor-sttter-gieffektivtno-et-borgerln',
        destination: '/articles/borgerlonn-pa-1-2-3',
        permanent: true,
      },
      {
        source: '/tpost/pjiz7x2cj9-endringer-i-anbefalte-organisasjoner',
        destination: '/articles/endringer-i-anbefalte-organisasjoner',
        permanent: true,
      },
      {
        source: '/tpost/npn2ntbo11-vi-m-snakke-om-administrasjonskostnader',
        destination: '/articles/vi-ma-snakke-om-administrasjonskostnader',
        permanent: true,
      }, //
      {
        source: '/tpost/npn2ntbo11-vi-m-snakke-om-administrasjonskostnader',
        destination: '/articles/vi-ma-snakke-om-administrasjonskostnader',
        permanent: true,
      },
      {
        source: '/tpost/ptdkrf7g8z-gi-effektivt',
        destination: '/articles/aa-gi-effektivt',
        permanent: true,
      },
      {
        source: '/tpost/xtuztcld41-kronikk-i-morgenbladet-er-det-tanken-som',
        destination: '/articles/er-det-tanken-som-teller',
        permanent: true,
      },
      {
        source: '/tpost/e9mef30mt1-worm-wars-hvorfor-mass-deworming-nr-fors',
        destination: '/articles/worm-wars',
        permanent: true,
      },
      {
        source: '/tpost/h6pxrfxhy0-hvorfor-gi',
        destination: '/articles/hvorfor-gi',
        permanent: true,
      },
      {
        source: '/tpost/j0k6mi1no1-kronikk-i-bistandsaktuelt-frp-forstr-ikk',
        destination: '/articles/frp-forstar-ikke-effektivitet',
        permanent: true,
      },
      {
        source: '/bistandsmyter',
        destination: '/kommer-snart',
        permanent: true,
      },
      {
        source: '/hvor-rik-er-jeg',
        destination: '/kommer-snart',
        permanent: true,
      },
      {
        source: '/aarsrapport21',
        destination: 'https://stiftelseneffekt.no/aarsrapport21',
        permanent: true,
      },
      {
        source: '/aarsrapport20',
        destination: 'https://stiftelseneffekt.no/aarsrapport20',
        permanent: true,
      },
      {
        source: '/aarsrapport19',
        destination: 'https://stiftelseneffekt.no/aarsrapport19',
        permanent: true,
      },
      {
        source: '/aarsrapport18',
        destination: 'https://stiftelseneffekt.no/aarsrapport18',
        permanent: true,
      },
      {
        source: '/fb-skattefradrag',
        destination: '/skattefradrag',
        permanent: true,
      },
      {
        source: '/gi',
        destination: '/',
        permanent: true,
      },
      {
        source: '/scorecard',
        destination: 'https://docs.google.com/spreadsheets/d/1kcDz-2eU5gOgdbxdbTdX1Bpztm6t5LjLD1_KsN89-ds/',
        permanent: false,
      },
      {
        source: '/resultater',
        destination: 'https://docs.google.com/spreadsheets/d/1kcDz-2eU5gOgdbxdbTdX1Bpztm6t5LjLD1_KsN89-ds/',
        permanent: false,
      },
      {
        source: '/aarsrapport',
        destination: 'https://stiftelseneffekt.no/aarsrapport21',
        permanent: false,
      },
      {
        source: '/filantropi',
        destination: '/kommer-snart',
        permanent: false,
      },
      {
        source: '/onepager',
        destination: 'https://drive.google.com/file/d/18qWoVYVhFpDilNssxbXfBQY_snSCxFkV/view?usp=sharing',
        permanent: true,
      },
    ]
  },
};

module.exports = nextConfig;
