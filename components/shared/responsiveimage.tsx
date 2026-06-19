import React from "react";
import { SanityImage } from "sanity-image";
import { SanityAsset, SanityImageObject } from "@sanity/image-url/lib/types/types";
import { getClient } from "../../lib/sanity.client";

export const ResponsiveImage: React.FC<{
  image: SanityImageObject;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  sizes?: string;
  layout?: "fill" | "responsive" | "cover" | "contain";
}> = ({ image, alt, onClick, priority, sizes, layout = "fill" }) => {
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

  // Get the project ID and dataset from the Sanity client
  const sanityClient = getClient();
  const projectId = sanityClient.config().projectId;
  const dataset = sanityClient.config().dataset;

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
  // For responsive layout, pass dimensions if available to help SanityImage
  if (layout === "responsive" && aspectRatio) {
    const containerStyle: React.CSSProperties = {
      width: "100%",
      aspectRatio: `${aspectRatio}`,
      display: "block",
    };

    const responsiveImageStyle: React.CSSProperties = {
      ...imageStyle,
      height: "100%",
      display: "block",
    };

    return (
      <div style={containerStyle}>
        <SanityImage
          id={imageId}
          projectId={projectId}
          dataset={dataset}
          mode={mode}
          preview={preview}
          hotspot={image.hotspot}
          crop={image.crop}
          alt={alt || "Image"}
          onClick={onClick}
          queryParams={
            {
              dpr: typeof window !== "undefined" ? window.devicePixelRatio : 2,
              q: 80,
            } as any
          }
          loading={priority ? "eager" : "lazy"}
          sizes={sizes ?? "(min-width: 1521px) 760px, (min-width: 1181px) 640px, 90vw"}
          style={responsiveImageStyle}
          {...dimensionProps}
        />
      </div>
    );
  }

  return (
    <SanityImage
      id={imageId}
      projectId={projectId}
      dataset={dataset}
      mode={mode}
      preview={preview}
      hotspot={image.hotspot}
      crop={image.crop}
      alt={alt || "Image"}
      onClick={onClick}
      queryParams={
        {
          dpr: typeof window !== "undefined" ? window.devicePixelRatio : 2,
          q: 80,
        } as any
      }
      loading={priority ? "eager" : "lazy"}
      sizes={sizes ?? "(min-width: 1521px) 760px, (min-width: 1181px) 640px, 90vw"}
      style={imageStyle}
      {...dimensionProps}
    />
  );
};

export default ResponsiveImage;
