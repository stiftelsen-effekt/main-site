import React from "react";
import style from "./PageHeader.module.scss";
import { NavLink } from "../../../shared/components/Navbar/Navbar";
import { Links, LinkType } from "../../blocks/Links/Links";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  layout?: "default" | "centered" | "hero";
  links?: (LinkType | NavLink)[];
}> = ({ title, inngress, links, layout = "default" }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        style[layout]
      }`}
    >
      <div data-cy="header-container">
        <h1>{title}</h1>
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
