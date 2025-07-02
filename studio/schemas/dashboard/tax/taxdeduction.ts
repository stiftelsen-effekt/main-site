import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../../validators/isShallowSlug";

export default defineType({
  title: "About tax deductions",
  name: "abouttaxdeductions",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "about",
      title: "Om skattefradrag",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "links",
      title: "Om skattefradrag lenker",
      type: "links",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "about",
      description: "Relative to tax page",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
});
