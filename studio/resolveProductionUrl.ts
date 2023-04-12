export default function resolveProductionUrl(doc: any) {
  let baseUrl = 'http://localhost:3000' 
  if (process.env.SANITY_STUDIO_VERCEL_ENV) {
    if (process.env.SANITY_STUDIO_VERCEL_ENV === 'production') {
      baseUrl = 'https://gieffektivt.no'
    }
    if (process.env.SANITY_STUDIO_VERCEL_ENV === 'preview') {
      baseUrl = `https://${process.env.SANITY_STUDIO_VERCEL_URL}`
    }
  }

  const previewUrl = new URL(baseUrl)

  previewUrl.pathname = `/api/preview`
  previewUrl.searchParams.append(`secret`, '480acccd7c2623ffa09e9363feccf9fb356d3e12fecbcae9261fa2cd3f9e0521')
  previewUrl.searchParams.append(`slug`, doc?.slug?.current ?? '')
  previewUrl.searchParams.append(`type`, doc?._type)

  return previewUrl.toString()
}