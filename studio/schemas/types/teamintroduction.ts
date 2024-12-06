import { Columns } from "react-feather";
import { blocktype } from "./blockcontent";

export default {
  name: "teamintroduction",
  type: "object",
  icon: Columns,
  title: "Team introduction",
  fields: [
    {
      name: "contributor",
      type: "reference",
      to: [{ type: "contributor" }],
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          ...blocktype,
          marks: {
            ...blocktype.marks,
            annotations: blocktype.marks.annotations.filter(
              (annotation) => annotation.name !== "citation",
            ),
          },
        },
      ],
    },
    {
      name: "links",
      type: "links",
      title: "Links",
    },
  ],
  preview: {
    select: {
      contributor: "contributor.name",
      media: "contributor.image",
    },
    prepare(selection: any) {
      return {
        title: selection.contributor,
        media: selection.media,
      };
    },
  },
} as const;
