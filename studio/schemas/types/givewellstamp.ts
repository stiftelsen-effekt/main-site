import { Award } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "givewellstamp",
  type: "document",
  title: "GiveWell stamp",
  icon: Award,
  fields: [
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "quote",
      type: "text",
      rows: 3,
      title: "Quote",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quotee",
      type: "string",
      title: "Quotee",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "quotee_position",
      type: "string",
      title: "Quotee position",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "quote",
      subtitle: "quotee",
    },
  },
});
