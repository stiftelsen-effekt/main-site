import { Columns } from "react-feather";

export default {
  name: "splitviewhtml",
  type: "object",
  icon: Columns,
  title: "Split view HTML embed",
  preview: {
    select: {
      title: "title",
      subtitle: "paragraph",
    },
  },
  fields: [
    {
      name: "swapped",
      type: "boolean",
      title: "Swapped",
    },
    {
      name: "darktext",
      type: "boolean",
      title: "Dark text",
    },
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "paragraph",
      type: "array",
      title: "Paragraph",
      of: [{ type: "block" }],
    },
    {
      name: "htmlcode",
      type: "text",
      lines: 10,
      title: "HTML code",
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;
