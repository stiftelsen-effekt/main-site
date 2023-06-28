export default function resolveProductionUrl(doc: any) {
  const baseUrl =
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_URL
      : process.env.NEXT_PUBLIC_SITE_URL || `http://localhost:3000`;
  const previewUrl = new URL(baseUrl);

  previewUrl.pathname = `/api/preview`;
  previewUrl.searchParams.append(
    `secret`,
    "480acccd7c2623ffa09e9363feccf9fb356d3e12fecbcae9261fa2cd3f9e0521",
  );
  previewUrl.searchParams.append(`slug`, doc?.slug?.current ?? "");
  previewUrl.searchParams.append(`type`, doc?._type);

  return previewUrl.toString();
}
