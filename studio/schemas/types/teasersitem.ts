import { defineType, defineField } from "sanity";
import { BlockTypePresets } from "../utils/blockContentHelpers";

export default defineType({
  name: "teasersitem",
  type: "object",
  title: "Teaser",
  preview: {
    select: {
      title: "title",
      media: "image",
    },
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "array",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
  ],
});
