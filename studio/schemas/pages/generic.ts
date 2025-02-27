import { GenericPagePreview } from "../../components/genericPagePreview";

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
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
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
      seoTitle: "header.seoTitle",
      slug: "slug.current",
    },
    prepare: (selection: { title: string; seoTitle: string; slug: string }) => {
      return {
        title: selection.title || selection.seoTitle || undefined,
        slug: selection.slug,
      };
    },
  },
  components: {
    preview: GenericPagePreview,
  },
} as const;
