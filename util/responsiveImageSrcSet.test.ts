import { describe, expect, test } from "@jest/globals";
import { buildResponsiveSrcSet } from "./responsiveImageSrcSet";

const baseUrl = "https://cdn.sanity.io/images/project/dataset/";

const parse = (srcSet: string) =>
  srcSet.split(", ").map((candidate) => {
    const [url, descriptor] = candidate.split(" ");
    const params = new URL(url).searchParams;
    return { params, w: Number(params.get("w")), descriptor: Number(descriptor.slice(0, -1)) };
  });

describe("buildResponsiveSrcSet", () => {
  test("uses width descriptors without dpr, capped at and including the source width", () => {
    const candidates = parse(
      buildResponsiveSrcSet({
        baseUrl,
        id: "image-abc123-1138x1138-jpg",
        mode: "contain",
        queryParams: { q: 80 },
      }),
    );
    expect(candidates.map((c) => c.w)).toEqual([128, 192, 256, 384, 512, 640, 768, 1024, 1138]);
    for (const c of candidates) {
      expect(c.descriptor).toBe(c.w);
      expect(c.params.has("dpr")).toBe(false);
      expect(c.params.get("q")).toBe("80");
      expect(c.params.get("auto")).toBe("format");
      expect(c.params.get("fit")).toBe("max");
    }
  });

  test("keeps the crop rect and caps at the cropped width", () => {
    const candidates = parse(
      buildResponsiveSrcSet({
        baseUrl,
        id: "image-abc123-1000x500-png",
        mode: "contain",
        crop: { top: 0, bottom: 0, left: 0.1, right: 0.1 },
      }),
    );
    expect(candidates.at(-1)?.w).toBe(800);
    for (const c of candidates) expect(c.params.get("rect")).toBe("100,0,800,500");
  });

  test("small sources get a single full-size candidate", () => {
    const candidates = parse(
      buildResponsiveSrcSet({ baseUrl, id: "image-abc123-100x50-png", mode: "contain" }),
    );
    expect(candidates.map((c) => c.w)).toEqual([100]);
  });

  test("scales descriptors for cover images wider than their box", () => {
    // A square image covering a 24:31 box is cropped at the sides: the visible part is 31/24 wider
    const candidates = parse(
      buildResponsiveSrcSet({ baseUrl, id: "image-abc123-608x608-jpg", mode: "cover" }, 24 / 31),
    );
    for (const c of candidates) expect(c.descriptor).toBe(Math.round((c.w * 24) / 31));
    // Images narrower than the box are not affected
    const portrait = parse(
      buildResponsiveSrcSet({ baseUrl, id: "image-abc123-768x1024-png", mode: "cover" }, 4 / 5),
    );
    for (const c of portrait) expect(c.descriptor).toBe(c.w);
  });
});
