import { defineType, defineField } from "sanity";
import { GenericPagePreview } from "../../components/genericPagePreview";

export default defineType({
  title: "Articles page",
  name: "articles",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageheader",
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
      name: "default_give_block",
      title: "Default give block",
      type: "giveblock",
    }),
    defineField({
      name: "related_articles_label",
      title: "Related articles label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "see_all_articles_label",
      title: "See all articles label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
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
