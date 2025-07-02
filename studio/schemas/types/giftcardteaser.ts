import { Gift } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "giftcardteaser",
  type: "document",
  title: "Gift card teaser",
  icon: Gift,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "array",
      title: "Description",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      validation: (Rule) => Rule.required(),
    }),
  ],
});
