import React from "react";
import style from "../../styles/PageHeader.module.css";
import { NavLink } from "../main/navbar";
import { Links, LinkType } from "./links";

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
      <div>
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
