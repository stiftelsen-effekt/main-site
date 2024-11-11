import { Star } from "react-feather";

export default {
  name: "giveblock",
  type: "object",
  title: "Give block",
  icon: Star,
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading",
    },
    {
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    },
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "paragraph",
    },
  },
} as const;
