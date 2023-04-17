import { Award } from "react-feather";

export default {
  name: "givewellstamp",
  type: "document",
  title: "GiveWell stamp",
  icon: Award,
  fields: [
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }],
    },
    {
      name: "quote",
      type: "text",
      rows: 3,
      title: "Quote",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "quotee",
      type: "string",
      title: "Quotee",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "quotee_position",
      type: "string",
      title: "Quotee position",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "quotee",
    },
  },
} as const;
