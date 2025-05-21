import { BarChart } from "react-feather";
import { blocktype } from "./blockcontent";

export default {
  type: "document",
  name: "dkmembershipdisplay",
  title: "DK Membership Display",
  icon: BarChart,
  fields: [
    {
      name: "membership_count_subtitle",
      title: "Membership count subtitle",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      title: "Description",
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
  ],
};
