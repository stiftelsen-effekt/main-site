import groq from "groq";
import { getClient } from "../lib/sanity.client";
import { RouterContextValue, fetchRouterContext } from "../context/RouterContext";

export default function SiteMap() {
  return null;
}

const siteMapQuery = groq`{
  "pages": *[_type in ["about_us", "articles", "generic_page", "article_page"] && !(_id in path('drafts.**'))]{
        _updatedAt,
        "slug": slug.current,
        sitemap_priority,
        "type": _type,
        _id,
    }
}
`;

export async function getServerSideProps({ res }: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { pages } = await getClient().fetch(siteMapQuery);
  const routerContext = await fetchRouterContext();

  const locations = pages.map((page: any) => {
    const { type, slug, sitemap_priority, _updatedAt } = page;

    const url = `${baseUrl}${getPath(type, slug, routerContext)}`;
    return `
          <loc>${url}</loc>
          <lastmod>${_updatedAt}</lastmod>
          <priority>${sitemap_priority ? sitemap_priority.toFixed(1) : "0.3"}</priority>
         `;
  });

  const createSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
            ${locations
              .map((location: any) => {
                return `<url>
                          ${location}
                        </url>
                      `;
              })
              .join("")}
        </urlset>
        `;
  res.setHeader("Cache-Control", "public, s-maxage=10800, stale-while-revalidate=32400");
  res.write(createSitemap());
  res.end();
  return {
    props: {},
  };
}

const getPath = (type: string, slug: string, routerContext: RouterContextValue) => {
  const slugWithoutSlash = slug.startsWith("/") ? slug.slice(1) : slug;
  switch (type) {
    case "article_page":
      return `/${[...routerContext.articlesPagePath, slugWithoutSlash].join("/")}`;
    default:
      return `/${slugWithoutSlash || ""}`;
  }
};
