import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/SplitView.module.css";
import { EffektButton } from "./effektbutton";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";

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
          <h2>{title}</h2>
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
