import React from "react";
import styles from "./Contributor.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export type ContributorType = {
  _id: string;
  image: SanityImageObject;
  displayImage?: boolean;
  name: string;
  first_name?: string; // Optional first name for display purposes
  email?: string;
  subrole?: string;
  additional?: string;
};

export const Contributor: React.FC<
  ContributorType & { contactLink?: boolean; locale?: string }
> = ({
  image,
  displayImage = true,
  name,
  first_name,
  email,
  subrole,
  additional,
  contactLink = false,
  locale = "no", // Default locale
}) => {
  let contactString = "";
  if (locale === "no") {
    contactString = "Ta kontakt med";
  } else if (locale === "dk") {
    contactString = "Tag kontakt med";
  } else if (locale === "sv") {
    contactString = "Ta kontakt med";
  } else {
    contactString = "Contact ";
  }

  return (
    <div className={styles.contributor}>
      {image != null && displayImage && (
        <div className={styles.contributor__image}>
          <ResponsiveImage layout="cover" image={image} sizes="90vw 240px 160px" />
        </div>
      )}
      <span className={styles.contributor__title}>{name}</span>
      <span className={styles.contributor__subrole + " detailheader"}>{subrole ?? ""}</span>
      <span className={styles.contributor__additional + " detailheader"}>{additional ?? ""}</span>
      {contactLink ? (
        <a href={`mailto:${email}`}>
          <span className={styles.contributor__email + " caption"}>
            → {contactString}
            <span className={styles.contributor__email_name}>
              {" "}
              {first_name ? first_name : name.split(" ")[0]}
            </span>
          </span>
        </a>
      ) : (
        <span className={styles.contributor__email + " caption"}>{email ?? ""}</span>
      )}
    </div>
  );
};
