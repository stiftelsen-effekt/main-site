import React from "react";
import { useNextSanityImage } from "next-sanity-image";
import { config } from "../../lib/config";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";

export const ResponsiveImage: React.FC<{
  image: SanityImageSource;
  alt?: string;
  onClick?: () => void;
  priority?: boolean;
}> = ({ image, alt, onClick, priority }) => {
  const imageProps = useNextSanityImage({ clientConfig: config }, image);

  return (
    <Image
      {...imageProps}
      layout="fill"
      objectFit="contain"
      sizes="(max-width: 800px) 100vw, 800px"
      alt={alt || "Image"}
      onClick={onClick}
      priority={priority}
    />
  );
};
