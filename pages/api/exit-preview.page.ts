import { NextApiRequest, NextApiResponse } from "next";

export default function exit(req: NextApiRequest, res: NextApiResponse) {
  res.clearPreviewData();

  // Only redirect to paths on this site, so the link can't be used as an open redirect
  const slug = Array.isArray(req?.query?.slug) ? req.query.slug[0] : req?.query?.slug;
  const location = slug && slug.startsWith("/") && !slug.startsWith("//") ? slug : "/";

  res.writeHead(307, { Location: location });
  res.end();
}
