import React from "react";
import elements from "./TeasersItem.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export interface TeasersItemProps {
  id: string;
  title: string;
  paragraph: string;
  disclaimer?: string;
  links?: (LinkType | NavLink)[];
  image: SanityImageObject;
  inverted?: boolean;
}

export const TeasersItem: React.FC<TeasersItemProps> = ({
  id,
  title,
  paragraph,
  disclaimer,
  links,
  image,
  inverted,
}) => {
  const classNames = [elements.teaser];
  if (inverted) {
    classNames.push(elements.inverted);
  }

  return (
    <div className={classNames.join(" ")}>
      <div className={elements.teaserimage}>
        <ResponsiveImage image={image} layout={"cover"} />
      </div>
      <div className={elements.teasertext}>
        <div>
          <h3>{title}</h3>
          <p>{paragraph}</p>
        </div>
        <div className={elements.teaserlinks}>
          {disclaimer && <p className={elements.teaserdisclaimer}>{disclaimer}</p>}
          {links && <Links links={links} buttons />}
        </div>
      </div>
    </div>
  );
};
