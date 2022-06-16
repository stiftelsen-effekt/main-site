import groq from "groq";
import { getClient } from "../lib/sanity.server";

export default function SiteMap() {
  return null;
}

const siteMapQuery = groq`{
  "pages": *[_type in ["frontpage", "about_us", "organizations", "articles", "support", "generic_page", "article_page"] && !(_id in path('drafts.**'))]{
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
  const { pages } = await getClient(false).fetch(siteMapQuery);

  const locations = pages.map((page: any) => {
    const { type, slug, sitemap_priority, _updatedAt } = page;

    const url = `${baseUrl}${getPath(type, slug)}`;
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

const getPath = (type: string, slug: string) => {
  switch (type) {
    case "article_page":
      return `/articles/${slug}`;
    default:
      return `/${slug || ""}`;
  }
};
