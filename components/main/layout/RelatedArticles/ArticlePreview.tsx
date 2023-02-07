import React from "react";
import { ArticleHeader } from "./RelatedArticles";
import styles from "./ArticlePreview.module.scss";
import Link from "next/link";

export const ArticlePreview: React.FC<{
  header: ArticleHeader;
  inngress?: string;
  slug: string;
}> = ({ header, inngress, slug }) => {
  return (
    <Link key={slug} href={`/artikler/${slug}`} passHref>
      <li className={styles.article}>
        {header.published && (
          <div className={styles.article__meta}>
            <span className="detailheader">
              {new Date(header.published).toLocaleDateString("NO-nb")}
            </span>
          </div>
        )}
        <h5>{header.title}</h5>
        {inngress && <p>{inngress}</p>}
      </li>
    </Link>
  );
};
