import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/FullImage.module.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";

export interface FullImage {
  alt: string;
  image: SanityImageSource;
}
export const FullImage: React.FC<FullImage> = ({ alt, image }) => {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <ResponsiveImage image={image} alt={alt} layout={"responsive"} />
    </div>
  );
};
