import React from "react";
import elements from "./TeasersItem.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";

export interface TeasersItemProps {
  title: string;
  paragraph: string;
  disclaimer?: string;
  links?: (LinkType | NavLink)[];
  image: SanityImageObject;
}

export const TeasersItem: React.FC<TeasersItemProps> = ({
  title,
  paragraph,
  disclaimer,
  links,
  image,
}) => {
  return (
    <div className={elements.teaser}>
      <div className={elements.teaserimage}>
        <ResponsiveImage image={image} />
      </div>
      <div className={elements.teasertext}>
        <div>
          <h4>{title}</h4>
          <p className="inngress">{paragraph}</p>
        </div>
        <div>
          {disclaimer && <p className={elements.teaserdisclaimer}>{disclaimer}</p>}
          {links && <Links links={links} buttons />}
        </div>
      </div>
    </div>
  );
};
