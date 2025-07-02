import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../../validators/isShallowSlug";

export default defineType({
  title: "Tax units",
  name: "taxunits",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "taxunits",
      description: "Relative to tax page",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
});
