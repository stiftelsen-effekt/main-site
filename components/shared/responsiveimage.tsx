import React from "react";
import { useNextSanityImage, UseNextSanityImageBuilder } from "next-sanity-image";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { sanityClient } from "../../lib/sanity.server";

export const ResponsiveImage: React.FC<{
  image: SanityImageSource;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  layout?: "intrinsic" | "fill" | "responsive" | "fixed";
  blur?: boolean;
  urlBuilder?: UseNextSanityImageBuilder;
}> = ({ image, alt, onClick, priority, layout = "fill", urlBuilder, blur = true }) => {
  const imageProps = useNextSanityImage(sanityClient, image, {
    imageBuilder: urlBuilder,
    enableBlurUp: blur ? undefined : false,
  });

  return (
    <Image
      {...imageProps}
      layout={layout}
      objectFit={layout === "fill" ? "contain" : "cover"}
      sizes="100vw, 1920px, 1440px, 800px, 400px"
      alt={alt || "Image"}
      onClick={onClick}
      priority={priority}
    />
  );
};
