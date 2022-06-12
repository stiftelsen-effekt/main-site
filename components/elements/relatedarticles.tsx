import Link from "next/link";
import styles from "../../styles/RelatedArticles.module.css";

export type ArticleHeader = {
  title: string;
  inngress?: string;
  published?: string;
};

export type RelatedArticle = {
  header: ArticleHeader;
  slug: string;
};

export const RelatedArticles: React.FC<{ relatedArticles: RelatedArticle[] }> = ({
  relatedArticles,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4>Relaterte artikler</h4>
        <div className={styles.viewall}>
          <Link href="/articles" passHref>
            <>
              <span>Se alle</span>
              <div>→</div>
            </>
          </Link>
        </div>
      </div>
      <div className={styles.articles}>
        {relatedArticles && (
          <ul className={styles.list}>
            {relatedArticles.map((article, i) => (
              <Link key={article.slug} href={`/articles/${article.slug}`} passHref>
                <li className={styles.article}>
                  {article.header.published && (
                    <div className={styles.article__meta}>
                      <span className="detailheader">
                        {new Date(article.header.published).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <h5>{article.header.title}</h5>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
