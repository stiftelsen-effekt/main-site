import React from "react";
import style from "./ArticleHeader.module.scss";

export const ArticleHeader: React.FC<{
  title: string;
  inngress?: string;
  published?: string;
}> = ({ title, inngress, published }) => {
  return (
    <section className={style.articleheader}>
      <div>
        <h1>{title}</h1>
      </div>
      {inngress ? <div>{inngress ? <p className="inngress">{inngress}</p> : null}</div> : null}
      {published ? (
        <div>
          {published ? <span>{new Date(published).toLocaleDateString("no-NB")}</span> : null}
        </div>
      ) : null}
    </section>
  );
};
