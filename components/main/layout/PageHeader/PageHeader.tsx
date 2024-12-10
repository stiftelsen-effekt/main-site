import React from "react";
import style from "./PageHeader.module.scss";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Links, LinkType } from "../../blocks/Links/Links";
import { SanityImageObject } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import { OpenWidgetButton } from "../../../shared/components/OpenWidgetButton/OpenWidgetButton";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  layout?: "default" | "centered" | "hero" | "coverPhoto" | "noheader";
  coverPhoto?: SanityImageObject;
  cta_type?: "link" | "navitem" | "open_widget";
  cta_label?: string;
  accent_color?: string;
  links?: (LinkType | NavLink)[];
}> = ({
  title,
  inngress,
  links,
  layout = "default",
  cta_type,
  cta_label,
  accent_color,
  coverPhoto,
}) => {
  const hasmetacontent = inngress || links;

  if (layout === "noheader") {
    return null;
  }

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        style[layout]
      }`}
    >
      <div data-cy="header-container">
        {layout !== "coverPhoto" && title && <h1>{title}</h1>}
        {layout === "coverPhoto" && coverPhoto && (
          <ResponsiveImage image={coverPhoto} alt={title} layout={"responsive"} sizes="100vw" />
        )}
      </div>
      {hasmetacontent ? (
        <div>
          {inngress ? <p className="inngress">{inngress}</p> : null}
          {links ? <Links links={links} /> : null}
          {layout === "hero" && cta_type === "open_widget" ? (
            <OpenWidgetButton
              label={cta_label}
              accent_color={accent_color}
              cy={"hero-cta-open-widget"}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
};

export const ctaButtonStyleOverrides = {
  alignSelf: "start",
  padding: ".75rem 4rem",
  marginTop: "1rem",
};
