import Link from "next/link";
import styles from "../../styles/RelatedArticles.module.css";
import { ArticlePreview } from "./articlepreview";

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
              <ArticlePreview key={article.slug} header={article.header} slug={article.slug} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
