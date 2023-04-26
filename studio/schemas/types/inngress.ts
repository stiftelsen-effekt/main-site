import { Type } from "react-feather";

export default {
  name: "inngress",
  type: "object",
  title: "Inngress",
  icon: Type,
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Heading",
    },
    {
      name: "body",
      type: "array",
      of: [{ type: "block" }],
      title: "body",
    },
    {
      name: "sidelinks",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
      title: "Sidelinks",
    },
  ],
} as const;
