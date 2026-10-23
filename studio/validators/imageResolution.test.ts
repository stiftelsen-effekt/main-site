import { describe, expect, it } from "@jest/globals";
import {
  checkImageResolution,
  FUNDRAISER_HEADER_MIN_WIDTH,
  FUNDRAISER_HEADER_RECOMMENDED_WIDTH,
  FUNDRAISER_IMAGE_MIN_SIZE,
  FUNDRAISER_IMAGE_RECOMMENDED_SIZE,
  getEffectiveDimensions,
  parseAssetDimensions,
} from "./imageResolution";

const HASH = "0a1b2c3d4e5f60718293a4b5c6d7e8f901234567";
const image = (width: number, height: number, ext = "jpg", crop?: object) => ({
  asset: { _ref: `image-${HASH}-${width}x${height}-${ext}` },
  crop,
});

const header = {
  minWidth: FUNDRAISER_HEADER_MIN_WIDTH,
  recommended: FUNDRAISER_HEADER_RECOMMENDED_WIDTH,
};
const photo = {
  minWidth: FUNDRAISER_IMAGE_MIN_SIZE,
  minHeight: FUNDRAISER_IMAGE_MIN_SIZE,
  recommended: FUNDRAISER_IMAGE_RECOMMENDED_SIZE,
};

describe("parseAssetDimensions", () => {
  it("parses width and height from the asset ref", () => {
    expect(parseAssetDimensions(`image-${HASH}-1200x450-png`)).toEqual({
      width: 1200,
      height: 450,
    });
  });

  it("skips SVGs, missing and malformed refs", () => {
    expect(parseAssetDimensions(`image-${HASH}-1200x450-svg`)).toBeUndefined();
    expect(parseAssetDimensions(undefined)).toBeUndefined();
    expect(parseAssetDimensions("image-abc-png")).toBeUndefined();
  });
});

describe("getEffectiveDimensions", () => {
  it("uses the full image when there is no crop", () => {
    expect(getEffectiveDimensions(image(1500, 1000))).toEqual({ width: 1500, height: 1000 });
  });

  it("subtracts the cropped fractions", () => {
    const crop = { left: 0.4, right: 0.408, top: 0.1, bottom: 0.1 };
    expect(getEffectiveDimensions(image(1500, 1000, "jpg", crop))).toEqual({
      width: 288,
      height: 800,
    });
  });
});

describe("checkImageResolution", () => {
  it("does not warn when no image is set", () => {
    expect(checkImageResolution(undefined, header)).toBe(true);
    expect(checkImageResolution({}, header)).toBe(true);
  });

  it("warns for a 1200 px header and recommends 3600 px", () => {
    expect(checkImageResolution(image(1200, 450), header)).toBe(
      "The image is only 1200 px wide after cropping and will look blurry on large screens. Upload an image at least 3600 px wide.",
    );
  });

  it("accepts a large header", () => {
    expect(checkImageResolution(image(4375, 1640), header)).toBe(true);
    expect(checkImageResolution(image(2400, 900), header)).toBe(true);
  });

  it("warns when the crop leaves too few pixels", () => {
    const result = checkImageResolution(
      image(3000, 1000, "jpg", { left: 0.3, right: 0.3 }),
      header,
    );
    expect(result).toContain("only 1200 px wide");
  });

  it("warns for a small fundraiser photo, by width or height", () => {
    expect(checkImageResolution(image(225, 225), photo)).toBe(
      "The image is only 225×225 px after cropping and will look blurry. Upload an image at least 600×600 px.",
    );
    expect(checkImageResolution(image(800, 300), photo)).toContain("800×300");
  });

  it("accepts a large enough fundraiser photo and skips SVGs", () => {
    expect(checkImageResolution(image(400, 400), photo)).toBe(true);
    expect(checkImageResolution(image(100, 100, "svg"), photo)).toBe(true);
  });
});
