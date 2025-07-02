import { defineType, defineField } from "sanity";
import { Columns } from "react-feather";
import { BlockTypePresets } from "../utils/blockContentHelpers";

export default defineType({
  name: "teamintroduction",
  type: "object",
  icon: Columns,
  title: "Team introduction",
  fields: [
    defineField({
      name: "contributor",
      type: "reference",
      to: [{ type: "contributor" }],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "links",
      type: "links",
      title: "Links",
    }),
  ],
  preview: {
    select: {
      contributor: "contributor.name",
      media: "contributor.image",
    },
    prepare(selection) {
      return {
        title: selection.contributor,
        media: selection.media,
      };
    },
  },
});
