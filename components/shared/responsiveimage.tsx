import React from "react";
import { useNextSanityImage } from "next-sanity-image";
import { SanityAsset, SanityImageObject } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { getClient } from "../../lib/sanity.client";

export const ResponsiveImage: React.FC<{
  image: SanityImageObject;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  sizes?: string;
  layout?: "intrinsic" | "fill" | "responsive" | "fixed" | "cover";
}> = ({ image, alt, onClick, priority, sizes, layout = "fill" }) => {
  const sanityClient = getClient();
  let imageProps = useNextSanityImage(sanityClient, image);

  if (!image) {
    return null;
  }

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
        sizes={sizes ?? "(min-width: 1521px) 760px, (min-width: 1181px) 640px, 90vw"}
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
        sizes={sizes ?? "(min-width: 1521px) 760px, (min-width: 1181px) 640px, 90vw"}
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
