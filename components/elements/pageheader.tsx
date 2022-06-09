import React, { ReactNode } from "react";
import style from "../../styles/PageHeader.module.css";
import { Links } from "./links";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  centered?: boolean;
  children?: ReactNode;
  custom__class?: string;

  links?: { _key: string; title: string; url: string }[];
}> = ({ children, title, inngress, links, centered, custom__class }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        centered ? style.centered : null
      } `}
    >
      <div className={`${custom__class}`}>
        <h1 className={`${style.pageheader__title}`}>{title}</h1>
        {children}
      </div>
      {hasmetacontent ? (
        <div>
          {inngress ? <p>{inngress}</p> : null}
          {links ? <Links links={links} /> : null}
        </div>
      ) : null}
    </section>
  );
};
