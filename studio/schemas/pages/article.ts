export default {
  title: "Article",
  name: "article_page",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "articleheader",
    },
    {
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "hidden",
      title: "Hidden",
      type: "boolean",
      description:
        "Hide article from the list of articles (article will still be accessible via direct link)",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: { header: { title: string } }, options: any) => doc.header.title,
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
} as const;
