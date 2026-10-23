import { useRouter } from "next/router";
import React from "react";
import styles from "./NormalImage.module.scss";
import type { SanityImageObject } from "@sanity/image-url";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export interface NormalImage {
  alt: string;
  image: SanityImageObject;
  caption: string;
  grayscale?: boolean;
}
export const NormalImage: React.FC<NormalImage> = ({ alt, image, caption, grayscale }) => {
  const classNames = [styles.wrapper];
  if (grayscale) classNames.push(styles.grayscale);

  return (
    <div className={classNames.join(" ")}>
      <ResponsiveImage
        image={image}
        alt={alt}
        layout={"responsive"}
        sizes="(min-width: 1521px) 760px, (min-width: 1181px) 640px, (min-width: 845px) 760px, 90vw"
      />
      <span className="caption">{caption}</span>
    </div>
  );
};
