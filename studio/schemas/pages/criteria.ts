import { defineType, defineField } from "sanity";

export default defineType({
  name: "criteria",
  type: "document",
  title: "Criteria",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageheader",
    }),
    defineField({
      name: "content",
      type: "array",
      title: "Content",
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
      initialValue: "criteria",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
});
