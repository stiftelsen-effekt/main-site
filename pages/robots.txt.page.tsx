import groq from "groq";
import { getClient } from "../lib/sanity.client";

export default function Robots() {
  return null;
}

const robotsQuery = groq`*[_id == "dashboard"][0].dashboard_slug.current`;

export async function getServerSideProps({ res }: any) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const dashboardslug = await getClient().fetch(robotsQuery);

  const createRobots = () => `User-agent: *
Allow: /
Disallow: /${dashboardslug}

Sitemap: ${baseUrl}/sitemap.xml`;
  res.setHeader("Cache-Control", "public, s-maxage=10800, stale-while-revalidate=32400");
  res.write(createRobots());
  res.end();
  return {
    props: {},
  };
}
