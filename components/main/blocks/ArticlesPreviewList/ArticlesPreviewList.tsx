import { groq } from "next-sanity";
import { getClient } from "../../../../lib/sanity.server";
import { withStaticProps } from "../../../../util/withStaticProps";
import { ArticlePreview } from "../../layout/RelatedArticles/ArticlePreview";
import styles from "./ArticlesPreviewList.module.scss";

export const ArticlesPreviewList = withStaticProps(async ({ preview }: { preview: boolean }) => {
  const result = await getClient(preview).fetch(fetchArticles);
  const articles = result.articles;
  return {
    articles,
  };
})(({ articles }) => {
  return (
    <div className={styles.articles}>
      {articles &&
        articles.map((article: any, i: number) => (
          <ArticlePreview
            key={article.slug}
            header={article.header}
            inngress={
              i === 0
                ? article.header.inngress ||
                  (article.preview.length > 350
                    ? article.preview.substr(0, 350) + "..."
                    : article.preview)
                : undefined
            }
            slug={article.slug}
          />
        ))}
    </div>
  );
});

const fetchArticles = groq`
{
  "articles": *[_type == "article_page"] | order(header.published desc) {
    header,
    "slug": slug.current,
    "preview": array::join(content[_type == "contentsection"][0].blocks[_type=="paragraph"][0].content[0..3].children[0...3].text, "\n"),
  }
}
`;
