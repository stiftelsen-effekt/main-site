import { Type } from "react-feather";
import { defineType, defineField } from "sanity";
import { BlockTypePresets } from "../utils/blockContentHelpers";

export default defineType({
  name: "column",
  type: "object",
  title: "Full image",
  icon: Type,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "richText",
      type: "array",
      title: "Rich text",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "paragraph",
      type: "text",
      rows: 5,
      title: "LEGACY paragraph",
      description: "Existing content is retained and displayed until rich text is added.",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
});
