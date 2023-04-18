import { Columns } from "react-feather";

export default {
  name: "splitview",
  type: "object",
  icon: Columns,
  title: "Split view",
  preview: {
    select: {
      title: "title",
      media: "image",
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
      type: "text",
      rows: 3,
      title: "Paragraph",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;
