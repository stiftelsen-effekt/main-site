import { Code } from "react-feather";

export default {
  name: "htmlembed",
  type: "object",
  title: "HTML Embed",
  icon: Code,
  fields: [
    {
      name: "htmlcode",
      type: "text",
      lines: 10,
      title: "HTML code",
    },
    {
      name: "fullwidth",
      type: "boolean",
      title: "Full width",
    },
    {
      name: "grayscale",
      type: "boolean",
      title: "Grayscale",
    },
  ],
} as const;
