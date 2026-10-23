/**
 * Warns (never blocks) when an uploaded image has too few pixels to look sharp
 * where it is displayed. Thresholds are display width in CSS px × device pixel
 * ratio, measured on the pixels left after the editor's crop.
 */

/**
 * Fundraiser header: displayed up to ~1714 CSS px wide. Warn below ~1.4× that
 * (2400 px), recommend ~2× DPR (3600 px) so retina screens get a sharp image.
 */
export const FUNDRAISER_HEADER_MIN_WIDTH = 2400;
export const FUNDRAISER_HEADER_RECOMMENDED_WIDTH = 3600;

/**
 * Fundraiser photo: displayed up to 200 CSS px, i.e. 400 px at 2× DPR and
 * 600 px at 3× DPR.
 */
export const FUNDRAISER_IMAGE_MIN_SIZE = 400;
export const FUNDRAISER_IMAGE_RECOMMENDED_SIZE = 600;

type ImageCrop = {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
};

type ImageValue = {
  asset?: { _ref?: string };
  crop?: ImageCrop;
};

type Dimensions = { width: number; height: number };

/**
 * Image asset ids have the form `image-<hash>-<width>x<height>-<ext>`
 * (see `imageAssetIdPattern` in @sanity/asset-utils).
 */
const IMAGE_ASSET_ID_PATTERN = /^image-[a-zA-Z0-9_]+-(\d+)x(\d+)-([a-z0-9]+)$/;

/**
 * Reads the original pixel dimensions from an image asset reference. Returns
 * undefined for SVGs (vector, resolution independent) and unparseable refs.
 */
export function parseAssetDimensions(ref: string | undefined): Dimensions | undefined {
  const match = ref?.match(IMAGE_ASSET_ID_PATTERN);
  if (!match) return undefined;

  const [, width, height, extension] = match;
  if (extension === "svg") return undefined;

  return { width: Number(width), height: Number(height) };
}

/**
 * Pixel dimensions left after applying the crop (crop values are fractions
 * of the original image removed from each side).
 */
export function getEffectiveDimensions(image: ImageValue | undefined): Dimensions | undefined {
  const dimensions = parseAssetDimensions(image?.asset?._ref);
  if (!dimensions) return undefined;

  const { top = 0, bottom = 0, left = 0, right = 0 } = image?.crop ?? {};
  return {
    width: Math.round(dimensions.width * (1 - left - right)),
    height: Math.round(dimensions.height * (1 - top - bottom)),
  };
}

type ResolutionOptions = {
  minWidth: number;
  minHeight?: number;
  recommended: number;
};

/**
 * Returns a warning message if the cropped image is below the minimum size,
 * otherwise true. Use with `Rule.custom(...).warning()`.
 */
export function checkImageResolution(
  image: ImageValue | undefined,
  { minWidth, minHeight, recommended }: ResolutionOptions,
): true | string {
  const effective = getEffectiveDimensions(image);
  if (!effective) return true;

  const tooNarrow = effective.width < minWidth;
  const tooShort = minHeight !== undefined && effective.height < minHeight;
  if (!tooNarrow && !tooShort) return true;

  if (minHeight === undefined) {
    return `The image is only ${effective.width} px wide after cropping and will look blurry on large screens. Upload an image at least ${recommended} px wide.`;
  }

  return `The image is only ${effective.width}×${effective.height} px after cropping and will look blurry. Upload an image at least ${recommended}×${recommended} px.`;
}
