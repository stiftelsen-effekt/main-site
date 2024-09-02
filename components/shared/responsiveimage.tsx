import React from "react";
import { useNextSanityImage } from "next-sanity-image";
import { SanityAsset, SanityImageObject } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { getClient } from "../../lib/sanity.client";

export const ResponsiveImage: React.FC<{
  image?: SanityImageObject;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  sizes?: string;
  layout?: "intrinsic" | "fill" | "responsive" | "fixed" | "cover";
}> = ({ image, alt, onClick, priority, sizes, layout = "fill" }) => {
  if (!image) {
    return null;
  }

  const sanityClient = getClient();
  let imageProps = useNextSanityImage(sanityClient, image);

  let lqip = null;
  if (
    image.asset &&
    (image.asset as SanityAsset).metadata &&
    (image.asset as SanityAsset).metadata.lqip
  ) {
    lqip = (image.asset as SanityAsset).metadata.lqip;
  }

  if (layout === "fill") {
    return (
      <Image
        src={imageProps.src}
        fill
        alt={alt || "Image"}
        onClick={onClick}
        priority={priority}
        blurDataURL={lqip}
        placeholder={lqip ? "blur" : "empty"}
        style={{ objectFit: "contain" }}
        sizes={sizes ?? "100vw 1920w 1000w 800w 600w 400w"}
      />
    );
  } else if (layout === "cover") {
    return (
      <Image
        src={imageProps.src}
        fill
        alt={alt || "Image"}
        onClick={onClick}
        priority={priority}
        blurDataURL={lqip}
        placeholder={lqip ? "blur" : "empty"}
        style={{ objectFit: "cover" }}
        sizes={sizes ?? "100vw 1920w 1000w 800w 600w 400w"}
      />
    );
  }

  return (
    <Image
      {...imageProps}
      layout={layout}
      alt={alt || "Image"}
      onClick={onClick}
      priority={priority}
      blurDataURL={lqip}
      placeholder={lqip ? "blur" : "empty"}
      style={{ width: "100%", height: "auto" }}
      sizes={sizes}
    />
  );
};
