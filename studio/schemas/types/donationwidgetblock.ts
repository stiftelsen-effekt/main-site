import { DollarSign } from "react-feather";
import { DistributionInput } from "../../components/distributionInput";
import { BlockTypePresets } from "../utils/blockContentHelpers";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "donationwidgetblock",
  type: "document",
  title: "Donation widget block",
  icon: DollarSign,
  fields: [
    defineField({
      name: "content",
      type: "array",
      title: "Content",
      description: "Optional content to display side by side with the donation widget",
      of: [BlockTypePresets.withoutCitations],
    }),
    defineField({
      name: "content_position",
      type: "string",
      title: "Content position",
      options: {
        list: ["left", "right"],
      },
      hidden: ({ parent }) => !parent?.content || parent.content.length === 0,
    }),
    defineField({
      name: "content_mobile_position",
      type: "string",
      title: "Content mobile position",
      options: {
        list: ["top", "bottom"],
      },
      hidden: ({ parent }) => !parent?.content || parent.content.length === 0,
    }),
    defineField({
      name: "donationwidget",
      type: "reference",
      title: "Donation widget configuration",
      to: [{ type: "donationwidget" }],
    }),
    defineField({
      name: "overrides",
      type: "object",
      title: "Overrides",
      description:
        "Override the settings from the donation widget configuration for this inline widget, non-overridden settings will be inherited from the donation widget configuration",
      fields: [
        defineField({
          name: "default_donation_type",
          title: "Default donation type",
          type: "string",
          options: {
            list: ["single", "recurring"],
          },
        }),
        // Can add more properties from the donation widget configuration here later
        defineField({
          name: "prefilled_distribution",
          type: "array",
          title: "Prefilled distribution",
          // This won't actually be used since we have a custom input component
          of: [
            {
              type: "object",
              fields: [
                defineField({ name: "type", type: "string" }),
                defineField({ name: "id", type: "number" }),
                defineField({ name: "causeAreaId", type: "number" }),
                defineField({ name: "percentage", type: "number" }),
                defineField({ name: "name", type: "string" }),
              ],
            },
          ],
          components: {
            input: DistributionInput,
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Inline donation widget",
    }),
    select: {
      title: "title",
    },
  },
});
