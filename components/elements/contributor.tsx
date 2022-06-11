import React from "react";
import styles from "../../styles/Contributor.module.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";
import { ImageUrlBuilder } from "next-sanity-image";

export type ContributorType = {
  _id: string;
  image: SanityImageSource;
  name: string;
  email?: string;
  subrole?: string;
  additional?: string;
};

const contributorImageBuilder = (imageUrlBuilder: ImageUrlBuilder) => {
  return imageUrlBuilder.width(240).height(310).saturation(-100).fit("clip");
};

export const Contributor: React.FC<ContributorType> = ({
  image,
  name,
  email,
  subrole,
  additional,
}) => {
  return (
    <li className={styles.contributor}>
      <div className={styles.contributor__image}>
        {image != null && (
          <ResponsiveImage layout="fixed" image={image} urlBuilder={contributorImageBuilder} />
        )}
      </div>
      <h3 className={styles.contributor__title}>{name}</h3>
      <div className={styles.contributor__subrole}>{subrole ?? ""}</div>
      <div className={styles.contributor__additional}>{additional ?? ""}</div>
      <div className={styles.contributor__email}>{email ?? ""}</div>
    </li>
  );
};
