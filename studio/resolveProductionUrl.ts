import { env } from "./env";

export default function resolveProductionUrl(doc: any) {
  const baseUrl = env.VERCEL_ENV === "preview" ? env.VERCEL_URL : env.SITE_URL;
  if (!baseUrl) throw new Error("No SITE_URL or VERCEL_URL env var provided");
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
