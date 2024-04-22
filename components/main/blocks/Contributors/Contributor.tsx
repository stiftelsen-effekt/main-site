import React from "react";
import styles from "./Contributor.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export type ContributorType = {
  _id: string;
  image: SanityImageObject;
  displayImage?: boolean;
  name: string;
  email?: string;
  subrole?: string;
  additional?: string;
};

export const Contributor: React.FC<ContributorType & { contactLink?: boolean }> = ({
  image,
  displayImage = true,
  name,
  email,
  subrole,
  additional,
  contactLink = false,
}) => {
  return (
    <div className={styles.contributor}>
      {image != null && displayImage && (
        <div className={styles.contributor__image}>
          <ResponsiveImage layout="fill" image={image} />
        </div>
      )}
      <span className={styles.contributor__title}>{name}</span>
      <span className={styles.contributor__subrole + " detailheader"}>{subrole ?? ""}</span>
      <span className={styles.contributor__additional + " detailheader"}>{additional ?? ""}</span>
      {contactLink ? (
        <a href={`mailto:${email}`}>
          <span className={styles.contributor__email + " caption"}>
            → Ta kontakt
            <span className={styles.contributor__email_name}> med {name.split(" ")[0]}</span>
          </span>
        </a>
      ) : (
        <span className={styles.contributor__email + " caption"}>{email ?? ""}</span>
      )}
    </div>
  );
};
