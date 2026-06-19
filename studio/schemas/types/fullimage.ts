import { Image } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "fullimage",
  type: "object",
  title: "Full image",
  icon: Image,
  preview: {
    select: {
      media: "image",
      title: "alt",
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
  ],
});
