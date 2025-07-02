import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  type: "document",
  title: "Testimonial",
  preview: {
    select: {
      title: "quotee",
      subtitle: "quotee_background",
      media: "image",
    },
  },
  fields: [
    defineField({
      name: "quote",
      type: "text",
      rows: 3,
      title: "Quote",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "quotee",
      type: "string",
      title: "Quotee",
    }),
    defineField({
      name: "quotee_background",
      title: "Quotee backgrond",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
});
