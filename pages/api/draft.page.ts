import { validatePreviewUrl } from "@sanity/preview-url-secret";
import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "next-sanity";
import { projectConfig } from "../../lib/config";

const token = process.env.SANITY_API_READ_TOKEN;
if (!token) {
  throw new Error(
    "A secret is provided but there is no `SANITY_API_READ_TOKEN` environment variable setup.",
  );
}
const client = createClient({
  ...projectConfig,
  useCdn: false,
  token,
});

export default async function handle(req: NextApiRequest, res: NextApiResponse<string | void>) {
  if (!req.url) {
    throw new Error("Missing url");
  }
  const { isValid, redirectTo = "/" } = await validatePreviewUrl(client, req.url);
  if (!isValid) {
    return res.status(401).send("Invalid secret");
  }
  console.log("Redirecting to", redirectTo);
  // Enable Draft Mode by setting the cookies
  res.setDraftMode({ enable: true });
  res.writeHead(307, { Location: redirectTo });
  res.end();
}
