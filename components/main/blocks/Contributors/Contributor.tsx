import React from "react";
import styles from "./Contributor.module.scss";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
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
    <div className={styles.contributor}>
      {image != null && (
        <div className={styles.contributor__image}>
          <ResponsiveImage layout="fill" image={image} urlBuilder={contributorImageBuilder} />
        </div>
      )}
      <span className={styles.contributor__title}>{name}</span>
      <span className={styles.contributor__subrole + " detailheader"}>{subrole ?? ""}</span>
      <span className={styles.contributor__additional + " detailheader"}>{additional ?? ""}</span>
      <span className={styles.contributor__email + " caption"}>{email ?? ""}</span>
    </div>
  );
};
