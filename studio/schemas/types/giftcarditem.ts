import { Gift } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "giftcarditem",
  type: "object",
  title: "Gift card",
  icon: Gift,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      type: "number",
      title: "Price",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative text",
      description: "Describes the image for screen readers. Falls back to the title if left empty.",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
      price: "price",
    },
    prepare: ({ title, media, price }) => ({
      title,
      subtitle: price != null ? String(price) : undefined,
      media,
    }),
  },
});
