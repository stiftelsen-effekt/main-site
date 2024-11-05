export default {
  title: "Articles page",
  name: "articles",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "pageheader",
    },
    {
      title: "Sitemap priority",
      name: "sitemap_priority",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0).max(1),
    },
    {
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "default_give_block",
      title: "Default give block",
      type: "giveblock",
    },
    {
      name: "related_articles_label",
      title: "Related articles label",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "see_all_articles_label",
      title: "See all articles label",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
} as const;
