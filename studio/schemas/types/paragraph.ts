import { Type } from "react-feather";
import { blocktype } from "./blockcontent";

export default {
  title: "Paragraph",
  name: "paragraph",
  type: "object",
  icon: Type,
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [blocktype, { type: "latex" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "content.0.children.0.text",
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return {
        title: title || " ",
        subtitle,
      };
    },
  },
} as const;
