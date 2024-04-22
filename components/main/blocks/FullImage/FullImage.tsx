import { useRouter } from "next/router";
import React from "react";
import styles from "./FullImage.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export interface FullImage {
  alt: string;
  image: SanityImageObject;
}
export const FullImage: React.FC<FullImage> = ({ alt, image }) => {
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <ResponsiveImage image={image} alt={alt} layout={"responsive"} />
    </div>
  );
};
