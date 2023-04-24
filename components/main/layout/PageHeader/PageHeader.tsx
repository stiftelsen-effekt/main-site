import React from "react";
import style from "./PageHeader.module.scss";
import { NavLink } from "../navbar";
import { Links, LinkType } from "../../blocks/Links/Links";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  centered?: boolean;
  inverted?: boolean;
  links?: (LinkType | NavLink)[];
}> = ({ title, inngress, links, centered, inverted }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : ""} ${
        centered ? style.centered : ""
      } ${inverted ? style.inverted : ""}`}
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
