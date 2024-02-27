import React from "react";
import { ArticleHeader } from "./RelatedArticles";
import styles from "./ArticlePreview.module.scss";
import Link from "next/link";
import { useRouterContext } from "../../../../context/RouterContext";

export const ArticlePreview: React.FC<{
  header: ArticleHeader;
  inngress?: string;
  slug: string;
}> = ({ header, inngress, slug }) => {
  const { articlesPagePath } = useRouterContext();

  return (
    <Link key={slug} href={`/${[...articlesPagePath, slug].join("/")}`} passHref>
      <a style={{ border: "none" }}>
        <li className={styles.article}>
          {header.published && (
            <div className={styles.article__meta}>
              <span className="detailheader">
                {new Date(header.published).toLocaleDateString("NO-nb")}
              </span>
            </div>
          )}
          <h2>{header.title}</h2>
          {inngress && <p>{inngress}</p>}
        </li>
      </a>
    </Link>
  );
};
