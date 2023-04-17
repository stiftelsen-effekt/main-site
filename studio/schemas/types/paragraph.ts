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
      of: [blocktype],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "content.0.children.0.text",
    },
  },
} as const;
