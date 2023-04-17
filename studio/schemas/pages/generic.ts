export default {
  title: "Generic page",
  name: "generic_page",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "pageheader",
    },
    {
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    },
    {
      title: "Sitemap priority",
      name: "sitemap_priority",
      type: "number",
      validation: (Rule: any) => Rule.required().min(0).max(1),
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
