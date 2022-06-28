import { useRouter } from "next/router";
import React from "react";
import styles from "./SplitView.module.scss";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export interface SplitView {
  title: string;
  swapped?: boolean;
  paragraph: string;
  link: string;
  image: SanityImageSource;
}
export const SplitView: React.FC<SplitView> = ({ title, swapped, paragraph, link, image }) => {
  const router = useRouter();

  const classes = [styles.splitview];
  if (swapped) classes.push(styles.swapped);

  return (
    <div className={classes.join(" ")}>
      <div className={styles.splitviewtext}>
        <div>
          <h5>{title}</h5>
          <p>{paragraph}</p>
        </div>
        {link && (
          <EffektButton
            onClick={() => {
              router.push(link);
            }}
          >
            Les mer
          </EffektButton>
        )}
      </div>
      <div className={styles.splitviewimage}>{image && <ResponsiveImage image={image} />}</div>
    </div>
  );
};
