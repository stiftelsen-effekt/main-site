import React from "react";
import styles from "./FullImage.module.scss";
import { SanityImageObject } from "@sanity/image-url";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export interface FullImage {
  alt: string;
  image: SanityImageObject;
}
export const FullImage: React.FC<FullImage> = ({ alt, image }) => {
  return (
    <div className={styles.wrapper}>
      <ResponsiveImage image={image} alt={alt} layout={"responsive"} sizes="100vw" />
    </div>
  );
};
