import { defineType, defineField } from "sanity";
import { List } from "react-feather";
import { PointlistPreview } from "../../components/pointlistPeview";

export default defineType({
  name: "pointlist",
  type: "document",
  title: "Pointlist",
  icon: List,
  fields: [
    defineField({
      name: "numbered",
      type: "boolean",
      title: "Numbered",
    }),
    defineField({
      title: "Numbering options",
      type: "object",
      name: "options",
      fields: [
        defineField({
          name: "layout",
          type: "string",
          title: "Layout",
          options: {
            list: ["left", "top"],
            layout: "radio",
          },
          initialValue: "left",
        }),
      ],
      hidden: ({ parent }: any) => !parent.numbered,
    }),
    defineField({
      name: "points",
      type: "array",
      title: "Points",
      of: [{ type: "pointlistpoint" }],
    }),
  ],
  preview: {
    select: {
      numbered: "numbered",
      points: "points",
    },
  },
  components: {
    preview: PointlistPreview,
  },
});
