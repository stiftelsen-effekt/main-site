import { Code } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "htmlembed",
  type: "object",
  title: "HTML Embed",
  icon: Code,
  fields: [
    defineField({
      name: "htmlcode",
      type: "text",
      rows: 10,
      title: "HTML code",
    }),
    defineField({
      name: "fullwidth",
      type: "boolean",
      title: "Full width",
    }),
    defineField({
      name: "grayscale",
      type: "boolean",
      title: "Grayscale",
    }),
  ],
});
