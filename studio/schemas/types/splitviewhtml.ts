import { Columns } from "react-feather";
import { blocktype } from "./blockcontent";

export default {
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
    {
      name: "swapped",
      type: "boolean",
      title: "Swapped",
    },
    {
      name: "rowSwapped",
      type: "boolean",
      title: "Row Swapped",
      description: "If checked text is on top in mobile view",
    },
    {
      name: "darktext",
      type: "boolean",
      title: "Dark text",
    },
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "paragraph",
      type: "array",
      title: "Paragraph",
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
      name: "htmlcode",
      type: "text",
      lines: 10,
      title: "HTML code",
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
    {
      name: "adoveoFundraiserId",
      type: "string",
      title: "Adoveo fundraiser ID",
    },
    {
      name: "vippsNumber",
      type: "string",
      title: "Vipps number",
    },
  ],
} as const;
