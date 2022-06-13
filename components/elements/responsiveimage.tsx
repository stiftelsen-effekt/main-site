import React from "react";
import { useNextSanityImage, UseNextSanityImageBuilder } from "next-sanity-image";
import { config } from "../../lib/config";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";

export const ResponsiveImage: React.FC<{
  image: SanityImageSource;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
  layout?: "intrinsic" | "fill" | "responsive" | "fixed";
  urlBuilder?: UseNextSanityImageBuilder;
}> = ({ image, alt, onClick, priority, layout = "fill", urlBuilder }) => {
  const imageProps = useNextSanityImage({ clientConfig: config }, image, {
    imageBuilder: urlBuilder,
  });

  return (
    <Image
      {...imageProps}
      layout={layout}
      objectFit={layout === "fill" ? "contain" : "cover"}
      sizes="(max-width: 800px) 100vw, 800px"
      alt={alt || "Image"}
      onClick={onClick}
      priority={priority}
    />
  );
};
