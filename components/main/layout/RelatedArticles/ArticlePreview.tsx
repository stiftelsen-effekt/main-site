import React from "react";
import { ArticleHeader } from "./RelatedArticles";
import styles from "./ArticlePreview.module.scss";
import Link from "next/link";

export const ArticlePreview: React.FC<{ header: ArticleHeader; slug: string }> = ({
  header,
  slug,
}) => {
  return (
    <Link key={slug} href={`/articles/${slug}`} passHref>
      <li className={styles.article}>
        {header.published && (
          <div className={styles.article__meta}>
            <span className="detailheader">{new Date(header.published).toLocaleDateString()}</span>
          </div>
        )}
        <h5>{header.title}</h5>
      </li>
    </Link>
  );
};
