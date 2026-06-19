import { defineType, defineField } from "sanity";
import { HelpCircle } from "react-feather";

export default defineType({
  name: "support",
  type: "document",
  title: "Support page",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "pageheader",
    }),
    defineField({
      name: "questionandanswergroups",
      title: "Questions and answers",
      type: "array",
      of: [{ type: "questionandanswergroup" }],
    }),
    defineField({
      name: "contact",
      title: "Contact info",
      type: "reference",
      to: [{ type: "contactinfo" }],
      options: {
        disableNew: true,
      },
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
      initialValue: "support",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
  },
});
