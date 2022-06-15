import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/NormalImage.module.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";

export interface NormalImage {
  alt: string;
  image: SanityImageSource;
  caption: string;
}
export const NormalImage: React.FC<NormalImage> = ({ alt, image, caption }) => {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <ResponsiveImage image={image} alt={alt} layout={"responsive"} />
      <span className="caption">{caption}</span>
    </div>
  );
};
