import { defineType, defineField } from "sanity";
import { Image } from "react-feather";

export default defineType({
  name: "normalimage",
  type: "object",
  title: "Normal image",
  icon: Image,
  preview: {
    select: {
      media: "image",
      title: "caption",
    },
  },
  fields: [
    defineField({
      name: "alt",
      type: "string",
      title: "Alternative text",
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "caption",
      type: "string",
      title: "Caption",
    }),
    defineField({
      name: "grayscale",
      type: "boolean",
      title: "Grayscale",
    }),
  ],
});
