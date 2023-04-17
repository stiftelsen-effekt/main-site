import { List } from "react-feather";
import { PointlistPreview } from "../../components/pointlistPeview";

export default {
  name: "pointlist",
  type: "document",
  title: "Pointlist",
  icon: List,
  fields: [
    {
      name: "numbered",
      type: "boolean",
      title: "Numbered",
    },
    {
      title: "Numbering options",
      type: "object",
      name: "options",
      fields: [
        {
          name: "layout",
          type: "string",
          title: "Layout",
          options: {
            list: ["left", "top"],
            layout: "radio",
          },
          initialValue: "left",
        },
      ],
      hidden: ({ parent }: any) => !parent.numbered,
    },
    {
      name: "points",
      type: "array",
      title: "Points",
      of: [{ type: "pointlistpoint" }],
    },
  ],
  preview: {
    select: {
      numbered: "numbered",
      points: "points",
    },
    component: PointlistPreview,
  },
} as const;
