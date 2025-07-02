import { defineType, defineField } from "sanity";

export default defineType({
  name: "vippsagreement",
  type: "document",
  title: "Vipps agreement splash page",
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
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "vippsagreement",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
});
