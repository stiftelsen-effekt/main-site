import type { NextApiRequest, NextApiResponse } from "next";
import { ConsentState } from "../../../middleware.page";
import { getClient } from "../../../lib/sanity.client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!req.query.fundraiserId || typeof req.query.fundraiserId !== "string") {
    return res.status(400).json({ message: "Missing fundraiser id" });
  }

  const fundraiserId = parseInt(req.query.fundraiserId, 10);
  if (isNaN(fundraiserId)) {
    return res.status(400).json({ message: "Invalid fundraiser id" });
  }

  // Get page slug by fundraiser id
  const client = getClient();
  const fundraiser = await client.fetch(
    `*[_type == "fundraiser_page" && fundraiser_database_id == $id][0] { slug { current } }`,
    { id: fundraiserId },
  );

  const slug = fundraiser?.slug?.current;
  if (!slug) {
    return res.status(404).json({ message: "Fundraiser not found" });
  }

  const siteSettings = await client.fetch(
    `*[_type == "site_settings"][0] { fundraiser_page_slug }`,
  );
  const fundraiserPath = siteSettings?.fundraiser_page_slug;
  if (!fundraiserPath) {
    return res.status(404).json({ message: "Fundraiser page not found" });
  }

  try {
    const consentStates: ConsentState[] = ["accepted", "rejected", "undecided"];
    const promises = consentStates.map((consentState) => {
      return res.revalidate(`/${consentState}/${fundraiserPath}/${slug}`);
    });
    await Promise.all(promises);

    // Set cache control headers to prevent caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.redirect(
      301,
      `/${fundraiserPath}/${slug}${req.query.plausible ? `?plausible=${req.query.plausible}` : ""}`,
    );
  } catch (err) {
    console.error(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
