import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../validators/isShallowSlug";

export default defineType({
  title: "Vipps Anonymous",
  name: "vipps-anonymous",
  type: "document",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "string",
      description: "The header text for the Vipps Anonymous page",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "vipps-anonymous",
      description: "Relative to dashboard",
      validation: (Rule) =>
        Rule.required()
          .custom(isShallowSlug)
          .custom((slug: any) => slug.current === "vipps-anonym" || "Slug must be 'vipps-anonym'"),
    }),
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
});
