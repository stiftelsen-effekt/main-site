import React from "react";
import styles from "../../styles/Contributor.module.css";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "./responsiveimage";

export type ContributorType = {
  _id: string;
  image: SanityImageSource;
  name: string;
  email?: string;
  subrole?: string;
  additional?: string;
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
      <ResponsiveImage layout="intrinsic" image={image} />
      <h3>{name}</h3>
      {subrole && <p>{subrole}</p>}
      {email && <p>{email}</p>}
      {additional && <p>{additional}</p>}
    </li>
  );
};
