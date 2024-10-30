import React from "react";
import elements from "./TeasersItem.module.scss";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { LinkType, Links } from "../Links/Links";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { PortableText } from "next-sanity";
import { customComponentRenderers } from "../Paragraph/Citation";

export interface TeasersItemProps {
  id: string;
  title: string;
  // Paragraph has been converted to portable text, but there might be legacy data that still uses string
  paragraph: string | Array<any>;
  links?: (LinkType | NavLink)[];
  image: SanityImageObject;
  inverted?: boolean;
}

export const TeasersItem: React.FC<TeasersItemProps> = ({
  id,
  title,
  paragraph,
  links,
  image,
  inverted,
}) => {
  const classNames = [elements.teaser];
  if (inverted) {
    classNames.push(elements.inverted);
  }
  const paragraphIsPortableText = Array.isArray(paragraph);

  return (
    <div className={classNames.join(" ")}>
      <div className={elements.teaserimage}>
        <ResponsiveImage image={image} layout={"cover"} />
      </div>
      <div className={elements.teasertext}>
        <div>
          <h3>{title}</h3>
          {paragraphIsPortableText ? (
            <div className={elements.teaserparagraph}>
              <PortableText value={paragraph} components={customComponentRenderers} />
            </div>
          ) : (
            <div className={elements.teaserparagraph}>{paragraph}</div>
          )}
        </div>
        <div className={elements.teaserlinks}>{links && <Links links={links} buttons />}</div>
      </div>
    </div>
  );
};
