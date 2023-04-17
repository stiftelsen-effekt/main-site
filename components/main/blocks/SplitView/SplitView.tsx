import { useRouter } from "next/router";
import React from "react";
import styles from "./SplitView.module.scss";
import { EffektButton } from "../../../shared/components/EffektButton/EffektButton";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType } from "../Links/Links";
import { NavLink } from "../../layout/navbar";
import { Links } from "../Links/Links";

export interface SplitView {
  title: string;
  swapped?: boolean;
  darktext?: boolean;
  paragraph: string;
  links: (LinkType | NavLink)[];
  image: SanityImageSource;
}
export const SplitView: React.FC<SplitView> = ({
  title,
  swapped,
  darktext,
  paragraph,
  links,
  image,
}) => {
  const router = useRouter();

  const classes = [styles.splitview];
  if (swapped) classes.push(styles.swapped);

  if (darktext) classes.push(styles.darktext);

  return (
    <div className={classes.join(" ")}>
      <div className={styles.splitviewtext}>
        <div>
          <h4>{title}</h4>
          <p>{paragraph}</p>
        </div>
        {links && <Links links={links} />}
      </div>
      <div className={styles.splitviewimage}>
        {image && <ResponsiveImage image={image} layout="responsive" />}
      </div>
    </div>
  );
};
