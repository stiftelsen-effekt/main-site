import React from "react";
import style from "./PageHeader.module.scss";
import { NavLink } from "../navbar";
import { Links, LinkType } from "../../blocks/Links/Links";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  centered?: boolean;
  links?: (LinkType | NavLink)[];
}> = ({ title, inngress, links, centered }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        centered ? style.centered : null
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
