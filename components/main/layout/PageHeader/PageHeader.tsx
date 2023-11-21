import React from "react";
import style from "./PageHeader.module.scss";
import { NavLink } from "../navbar";
import { Links, LinkType } from "../../blocks/Links/Links";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  layout?: "default" | "centered" | "hero" | "coverPhoto";
  coverPhoto?: SanityImageSource;
  links?: (LinkType | NavLink)[];
}> = ({ title, inngress, links, layout = "default", coverPhoto }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        style[layout]
      }`}
    >
      <div data-cy="header-container">
        {layout !== "coverPhoto" && title && <h1>{title}</h1>}
        {layout === "coverPhoto" && coverPhoto && (
          <ResponsiveImage image={coverPhoto} alt={title} layout={"responsive"} />
        )}
      </div>
      {hasmetacontent ? (
        <div>
          {inngress ? <p className="inngress">{inngress}</p> : null}
          {links ? <Links links={links} /> : null}
        </div>
      ) : null}
    </section>
  );
};
