import Link from "next/link";
import styles from "./RelatedArticles.module.scss";
import { ArticlePreview } from "./ArticlePreview";
import { useRouterContext } from "../../../../context/RouterContext";

export type ArticleHeader = {
  title: string;
  inngress?: string;
  published?: string;
};

export type RelatedArticle = {
  header: ArticleHeader;
  slug: string;
};

export const RelatedArticles: React.FC<{
  relatedArticles: RelatedArticle[];
  relatedArticlesLabel: string;
  seeAllArticlesLabel: string;
}> = ({ relatedArticles, relatedArticlesLabel, seeAllArticlesLabel }) => {
  const { articlesPagePath } = useRouterContext();

  return (
    <div className={styles.wrapper} data-toc-id="related">
      <div className={styles.header}>
        <h4>{relatedArticlesLabel}</h4>
        <div className={styles.viewall}>
          <Link href={`/${articlesPagePath.join("/")}`} passHref>
            <span>{seeAllArticlesLabel}</span>
            <div>→</div>
          </Link>
        </div>
      </div>
      <div className={styles.articles}>
        {relatedArticles && (
          <ul className={styles.list}>
            {relatedArticles.map((article, i) => (
              <ArticlePreview key={article.slug} header={article.header} slug={article.slug} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
