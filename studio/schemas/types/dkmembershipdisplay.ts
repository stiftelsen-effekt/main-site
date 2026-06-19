import { BarChart } from "react-feather";
import { BlockTypePresets } from "../utils/blockContentHelpers";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "dkmembershipdisplay",
  title: "DK Membership Display",
  icon: BarChart,
  fields: [
    defineField({
      name: "membership_count_subtitle",
      title: "Membership count subtitle",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [BlockTypePresets.withoutCitations],
    }),
  ],
});
