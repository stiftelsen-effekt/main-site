import { AlignLeft } from "react-feather";

export default {
  name: "introsection",
  type: "object",
  title: "Intro section",
  icon: AlignLeft,
  preview: {
    select: {
      title: "heading",
      subtitle: "paragraph",
    },
  },
  fields: [
    {
      name: "heading",
      type: "text",
      rows: 3,
      title: "Heading",
    },
    {
      name: "paragraph",
      type: "text",
      rows: 3,
      title: "Paragraph",
    },
  ],
};
