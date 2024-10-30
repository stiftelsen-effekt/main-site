import { blocktype } from "./blockcontent";

export default {
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
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "paragraph",
      title: "Paragraph",
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
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
  ],
} as const;
