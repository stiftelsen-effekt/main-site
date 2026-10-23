import { buildSrc } from "sanity-image";

/**
 * Candidate widths for the srcset. Every candidate is capped at the (cropped) source width, and
 * the source width itself is always included, so the largest candidate is never upscaled and a
 * high-DPR screen can always get the full-resolution image.
 */
export const SRCSET_WIDTHS = [
  128, 192, 256, 384, 512, 640, 768, 1024, 1280, 1600, 1920, 2560, 3200, 3840,
];

export type ImageParams = Parameters<typeof buildSrc>[0];

/**
 * Builds a srcset with width descriptors. No `dpr` param is sent: with width descriptors the
 * browser already multiplies the slot width from `sizes` by the device pixel ratio.
 *
 * With `coverAspectRatio` (object-fit: cover in a box of that aspect ratio), an image that is
 * wider than its box is cropped at the sides, so the visible part is wider than the box. The
 * descriptors are divided by that factor so the browser picks enough pixels for the visible width.
 */
export const buildResponsiveSrcSet = (
  params: Omit<ImageParams, "width" | "height">,
  coverAspectRatio?: number,
): string => {
  const full = buildSrc({ ...params, width: Number.MAX_SAFE_INTEGER });
  const sourceWidth = full.width;
  const coverFactor = coverAspectRatio
    ? Math.max(1, full.width / full.height / coverAspectRatio)
    : 1;

  const widths = [...SRCSET_WIDTHS.filter((w) => w < sourceWidth), sourceWidth];
  const candidates = new Map<number, string>();
  for (const width of widths) {
    const descriptor = Math.round(width / coverFactor);
    if (!candidates.has(descriptor)) {
      candidates.set(descriptor, `${buildSrc({ ...params, width }).src} ${descriptor}w`);
    }
  }
  return Array.from(candidates.values()).join(", ");
};
