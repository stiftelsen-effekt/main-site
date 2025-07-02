import { defineType, defineField } from "sanity";
import { GenericPagePreview } from "../../components/genericPagePreview";

export default defineType({
  title: "Article",
  name: "article_page",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "articleheader",
    }),
    defineField({
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      description:
        "Hide article from the list of articles (article will still be accessible via direct link)",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: { header: { title: string } }, options: any) => doc.header.title,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
      seoTitle: "header.seoTitle",
      slug: "slug.current",
    },
    prepare: (selection: { title: string; seoTitle; slug: string }) => {
      return {
        title: selection.title || selection.seoTitle || undefined,
        slug: `artikler/${selection.slug}`,
      };
    },
  },
  components: {
    preview: GenericPagePreview,
  },
});
