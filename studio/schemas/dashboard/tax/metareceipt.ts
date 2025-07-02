import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../../validators/isShallowSlug";

export default defineType({
  title: "Meta receipt",
  name: "metareceipt",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "facebook_description",
      title: "Hvordan finne betalings-ID",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "facebook_description_links",
      title: "Hvordan finne betalings-ID lenker",
      type: "links",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "facebook-instagram",
      description: "Relative to tax page",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
});
