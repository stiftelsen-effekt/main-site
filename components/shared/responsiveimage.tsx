import React from "react";
import { ImageWithPreview, SanityImage, buildSrc } from "sanity-image";
import type { SanityAsset, SanityImageObject } from "@sanity/image-url";
import { projectConfig } from "../../lib/config";
import { buildResponsiveSrcSet } from "../../util/responsiveImageSrcSet";

const DEFAULT_SIZES = "(min-width: 1521px) 760px, (min-width: 1181px) 640px, 90vw";

export const ResponsiveImage: React.FC<{
  image: SanityImageObject;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  /** Must match the rendered CSS width of the image per breakpoint, or retina screens get blurry images. */
  sizes?: string;
  layout?: "fill" | "responsive" | "cover" | "contain";
  /** For layout="cover": the narrowest width / height ratio of the box the image covers. */
  coverAspectRatio?: number;
}> = ({ image, alt, onClick, priority, sizes, layout = "fill", coverAspectRatio }) => {
  if (!image) {
    return null;
  }

  if (!image.asset) {
    return null;
  }

  // Extract the image ID from the Sanity image object
  const imageId = image.asset?._ref || (image.asset as SanityAsset)._id;

  if (!imageId) {
    return null;
  }

  const { projectId, dataset } = projectConfig;
  const baseUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/`;

  // Extract LQIP for preview
  const preview = (image as any).asset?.metadata?.lqip;

  // Extract dimensions for aspect ratio calculation
  const dimensions = (image as any).asset?.metadata?.dimensions;
  const aspectRatio = dimensions ? dimensions.width / dimensions.height : undefined;

  // Convert layout to mode (cover or contain)
  const mode = layout === "cover" ? "cover" : "contain";

  // Set appropriate style based on layout
  const imageStyle: React.CSSProperties = {
    objectFit: mode,
    width: "100%",
    height: layout === "fill" || layout === "cover" ? "100%" : "auto",
  };

  // Set appropriate dimensions if needed
  const dimensionProps: {
    width?: number;
    height?: number;
  } = {};
  if (layout !== "fill" && layout !== "responsive") {
    dimensionProps.width = 800;
  }

  const isResponsive = layout === "responsive" && aspectRatio;
  const style: React.CSSProperties = isResponsive
    ? { ...imageStyle, height: "100%", display: "block" }
    : imageStyle;

  const imageParams = {
    baseUrl,
    id: imageId,
    mode,
    hotspot: image.hotspot,
    crop: image.crop,
    queryParams: { q: 80 },
  } as const;

  const imageProps = {
    alt: alt || "Image",
    onClick,
    loading: priority ? ("eager" as const) : ("lazy" as const),
    sizes: sizes ?? DEFAULT_SIZES,
    style,
  };

  let img: React.ReactElement;
  if (imageId.endsWith("-svg")) {
    // SVGs are served as-is, without a srcset
    img = (
      <SanityImage
        id={imageId}
        baseUrl={baseUrl}
        mode={mode}
        preview={preview}
        hotspot={image.hotspot}
        crop={image.crop}
        {...imageProps}
        {...dimensionProps}
      />
    );
  } else {
    // `src` and the width/height attributes are unchanged; only the srcset candidates differ
    const { src, width, height } = buildSrc({ ...imageParams, ...dimensionProps });
    const attributes = {
      ...imageProps,
      srcSet: buildResponsiveSrcSet(imageParams, layout === "cover" ? coverAspectRatio : undefined),
      src,
      width,
      height,
    };
    img = preview ? (
      <ImageWithPreview as="img" preview={preview} {...attributes} />
    ) : (
      // The Sanity CDN already resizes and picks AVIF/WebP, so next/image would only add a proxy hop
      // eslint-disable-next-line @next/next/no-img-element
      <img {...attributes} alt={attributes.alt} />
    );
  }

  if (isResponsive) {
    const containerStyle: React.CSSProperties = {
      width: "100%",
      aspectRatio: `${aspectRatio}`,
      display: "block",
    };

    return <div style={containerStyle}>{img}</div>;
  }

  return img;
};

export default ResponsiveImage;
