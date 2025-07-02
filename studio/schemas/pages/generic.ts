import { defineType, defineField } from "sanity";
import { GenericPagePreview } from "../../components/genericPagePreview";

export default defineType({
  title: "Generic page",
  name: "generic_page",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageheader",
    }),
    defineField({
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    }),
    defineField({
      title: "Sitemap priority",
      name: "sitemap_priority",
      type: "number",
      validation: (Rule) => Rule.required().min(0).max(1),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
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
});
