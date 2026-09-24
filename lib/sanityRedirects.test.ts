import { appendQueryAndHash, resolveNavitemHref } from "./pageHref";
import { mapSanityRedirects, resolveRedirectDestination } from "./sanityRedirects";

describe("resolveNavitemHref", () => {
  it("resolves a generic page slug", () => {
    expect(resolveNavitemHref("generic_page", "topplista", ["artikler"], ["innsaming"])).toBe(
      "/topplista",
    );
  });

  it("nests article slugs under the articles overview path", () => {
    expect(resolveNavitemHref("article_page", "my-post", ["artikler"], ["innsaming"])).toBe(
      "/artikler/my-post",
    );
  });

  it("nests fundraiser slugs under the fundraiser prefix", () => {
    expect(resolveNavitemHref("fundraiser_page", "wahl", ["artikler"], ["innsaming"])).toBe(
      "/innsaming/wahl",
    );
  });

  it("normalizes a homepage slug to /", () => {
    expect(resolveNavitemHref("generic_page", "/", [], [])).toBe("/");
  });
});

describe("appendQueryAndHash", () => {
  it("appends query and hash without requiring prefixes", () => {
    expect(appendQueryAndHash("/topplista", "recurring=1", "orgs")).toBe(
      "/topplista?recurring=1#orgs",
    );
  });

  it("accepts already-prefixed query and hash", () => {
    expect(appendQueryAndHash("/topplista", "?recurring=1", "#orgs")).toBe(
      "/topplista?recurring=1#orgs",
    );
  });

  it("merges query onto a path that already has one", () => {
    expect(appendQueryAndHash("/topplista?foo=1", "recurring=1")).toBe(
      "/topplista?foo=1&recurring=1",
    );
  });

  it("lets an explicit hash replace one already on the path", () => {
    expect(appendQueryAndHash("/topplista#old", undefined, "new")).toBe("/topplista#new");
  });
});

describe("resolveRedirectDestination", () => {
  const articles = ["artikler"];
  const fundraisers = ["innsaming"];

  it("prefers a page slug over a custom destination", () => {
    expect(
      resolveRedirectDestination(
        { slug: "topplista", pagetype: "generic_page", destination: "/stale" },
        articles,
        fundraisers,
      ),
    ).toBe("/topplista");
  });

  it("keeps query and hash when the page slug is resolved", () => {
    expect(
      resolveRedirectDestination(
        {
          slug: "topplista",
          pagetype: "generic_page",
          query: "recurring=1",
          hash: "list",
        },
        articles,
        fundraisers,
      ),
    ).toBe("/topplista?recurring=1#list");
  });

  it("appends query and hash after an article slug change would still resolve", () => {
    expect(
      resolveRedirectDestination(
        {
          slug: "new-article-slug",
          pagetype: "article_page",
          query: "utm_source=newsletter",
        },
        articles,
        fundraisers,
      ),
    ).toBe("/artikler/new-article-slug?utm_source=newsletter");
  });

  it("falls back to a custom path or URL", () => {
    expect(
      resolveRedirectDestination(
        { destination: "https://example.com/docs", query: "ref=1" },
        articles,
        fundraisers,
      ),
    ).toBe("https://example.com/docs?ref=1");
  });

  it("returns null when neither a page slug nor a path is set", () => {
    expect(resolveRedirectDestination({ source: "/old" }, articles, fundraisers)).toBeNull();
  });
});

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

  it("maps a page-backed redirect with query params using navlink prefixes", () => {
    expect(
      mapSanityRedirects(
        [
          {
            source: "/organizations",
            slug: "topplista",
            pagetype: "generic_page",
            query: "recurring=1",
          },
        ],
        { articlesSlug: "artikler", fundraiserSlug: "innsaming" },
      ),
    ).toEqual([
      { source: "/organizations", destination: "/topplista?recurring=1", permanent: true },
    ]);
  });
});
