import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for secret to confirm this is a valid request. Reject everything if the token isn't
  // configured, otherwise a request without a secret would match the missing token.
  const token = process.env.REVALIDATE_TOKEN;
  if (!token || req.query.secret !== token) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (!req.query.path || typeof req.query.path !== "string") {
    return res.status(400).json({ message: "Missing path" });
  }

  try {
    await res.revalidate(req.query.path);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
