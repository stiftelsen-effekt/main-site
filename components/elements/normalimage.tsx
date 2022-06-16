import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/NormalImage.module.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";

export interface NormalImage {
  alt: string;
  image: SanityImageSource;
  caption: string;
  grayscale?: boolean;
}
export const NormalImage: React.FC<NormalImage> = ({ alt, image, caption, grayscale }) => {
  const router = useRouter();

  const classNames = [styles.wrapper];
  if (grayscale) classNames.push(styles.grayscale);

  return (
    <div className={classNames.join(" ")}>
      <ResponsiveImage image={image} alt={alt} layout={"responsive"} />
      <span className="caption">{caption}</span>
    </div>
  );
};
