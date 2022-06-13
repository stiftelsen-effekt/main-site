import React from "react";
import style from "../../styles/ArticleHeader.module.css";

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
      {inngress ? <div>{inngress ? <p>{inngress}</p> : null}</div> : null}
      {published ? (
        <div>{published ? <span>{new Date(published).toLocaleDateString()}</span> : null}</div>
      ) : null}
    </section>
  );
};
