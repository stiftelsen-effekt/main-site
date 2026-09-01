import { mapSanityRedirects } from "./sanityRedirects";

describe("mapSanityRedirects", () => {
  it("maps a site-wide redirect without host conditions", () => {
    expect(mapSanityRedirects([{ source: "/old", destination: "/new", permanent: true }])).toEqual([
      { source: "/old", destination: "/new", permanent: true },
    ]);
  });

  it("treats missing permanent as a 301", () => {
    expect(mapSanityRedirects([{ source: "/a", destination: "/b" }])).toEqual([
      { source: "/a", destination: "/b", permanent: true },
    ]);
  });

  it("keeps temporary redirects as 302", () => {
    expect(mapSanityRedirects([{ source: "/a", destination: "/b", permanent: false }])).toEqual([
      { source: "/a", destination: "/b", permanent: false },
    ]);
  });

  it("expands each country host into its own Next.js rule", () => {
    expect(
      mapSanityRedirects([
        {
          source: "/faq",
          destination: "/ofte-stilte-sporsmal",
          permanent: true,
          hosts: ["gieffektivt.no", "geeffektivt.se"],
        },
      ]),
    ).toEqual([
      {
        source: "/faq",
        destination: "/ofte-stilte-sporsmal",
        permanent: true,
        has: [{ type: "host", value: "gieffektivt.no" }],
      },
      {
        source: "/faq",
        destination: "/ofte-stilte-sporsmal",
        permanent: true,
        has: [{ type: "host", value: "geeffektivt.se" }],
      },
    ]);
  });

  it("drops incomplete entries", () => {
    expect(
      mapSanityRedirects([
        { source: "/only-source" },
        { destination: "/only-destination" },
        { source: "/ok", destination: "/yes" },
      ]),
    ).toEqual([{ source: "/ok", destination: "/yes", permanent: true }]);
  });
});
