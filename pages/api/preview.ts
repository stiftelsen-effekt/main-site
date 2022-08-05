import { NextApiRequest, NextApiResponse } from "next"

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  if (!req?.query?.secret) {
    return res.status(401).json({message: 'No secret token'})
  }

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== process.env.SANITY_PREVIEW_SECRET && req.query.secret !== "480acccd7c2623ffa09e9363feccf9fb356d3e12fecbcae9261fa2cd3f9e0521") {
    return res.status(401).json({message: 'Invalid secret token'})
  }

  if (!req.query.slug) {
    return res.status(401).json({message: 'No slug'})
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  switch (req.query.type) {
    case 'frontpage':
      res.writeHead(307, {Location: `/` })
    case 'generic_page':
      res.writeHead(307, {Location: `/${req?.query?.slug}` ?? `/`})
      break
    case 'article_page':
      res.writeHead(307, {Location: `/articles/${req?.query?.slug}` ?? `/`})
      break
    default:
      return res.status(400).json({message: 'Preview not supported for page'})
  }
  

  return res.end()
}