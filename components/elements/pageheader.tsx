import React, { ReactNode } from "react";
import style from "../../styles/PageHeader.module.css";
import { Links } from "./links";

export const PageHeader: React.FC<{
  title: string;
  inngress?: string;
  centered?: boolean;
  children?: ReactNode;

  links?: { _key: string; title: string; url: string }[];
}> = ({ children, title, inngress, links, centered }) => {
  const hasmetacontent = inngress || links;

  return (
    <section
      className={`${style.pageheader} ${hasmetacontent ? style.pageheadermeta : null} ${
        centered ? style.centered : null
      }`}
    >
      <div>
        <h1>{title}</h1>
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
