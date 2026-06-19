import { defineType, defineField } from "sanity";
import { Columns } from "react-feather";
import { BlockTypePresets } from "../utils/blockContentHelpers";

export default defineType({
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
    defineField({
      name: "swapped",
      type: "boolean",
      title: "Swapped",
    }),
    defineField({
      name: "rowSwapped",
      type: "boolean",
      title: "Row Swapped",
      description: "If checked text is on top in mobile view",
    }),
    defineField({
      name: "darktext",
      type: "boolean",
      title: "Dark text",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "paragraph",
      type: "array",
      title: "Paragraph",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "htmlcode",
      type: "text",
      rows: 10,
      title: "HTML code",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
    defineField({
      name: "adoveoFundraiserId",
      type: "string",
      title: "Adoveo fundraiser ID",
    }),
    defineField({
      name: "vippsNumber",
      type: "string",
      title: "Vipps number",
    }),
  ],
});
