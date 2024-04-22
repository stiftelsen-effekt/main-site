import React from "react";
import { useNextSanityImage } from "next-sanity-image";
import { SanityAsset, SanityImageObject } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { sanityClient } from "../../lib/sanity.server";

export const ResponsiveImage: React.FC<{
  image: SanityImageObject;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  layout?: "intrinsic" | "fill" | "responsive" | "fixed";
}> = ({ image, alt, onClick, priority, layout = "fill" }) => {
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
        sizes="100vw, 1920px, 1440px, 800px, 400px"
      />
    );
  }

  return (
    <Image
      {...imageProps}
      layout={layout}
      sizes="100vw, 1920px, 1440px, 800px, 400px"
      alt={alt || "Image"}
      onClick={onClick}
      priority={priority}
      blurDataURL={lqip}
    />
  );
};
