import { Type } from "react-feather";

export default {
  name: "column",
  type: "object",
  title: "Full image",
  icon: Type,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "paragraph",
      type: "text",
      rows: 5,
      title: "Paragraph",
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;
