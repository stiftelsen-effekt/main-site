import { DistributionInput } from "../../components/distributionInput";
import { blocktype } from "./blockcontent";

export default {
  name: "donationwidgetblock",
  type: "document",
  title: "Donation widget block",
  fields: [
    {
      name: "content",
      type: "array",
      title: "Content",
      description: "Optional content to display side by side with the donation widget",
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
      name: "content_position",
      type: "string",
      title: "Content position",
      options: {
        list: ["left", "right"],
      },
      hidden: ({ parent }) => !parent?.content || parent.content.length === 0,
    },
    {
      name: "content_mobile_position",
      type: "string",
      title: "Content mobile position",
      options: {
        list: ["top", "bottom"],
      },
      hidden: ({ parent }) => !parent?.content || parent.content.length === 0,
    },
    {
      name: "donationwidget",
      type: "reference",
      title: "Donation widget configuration",
      to: [{ type: "donationwidget" }],
    },
    {
      name: "overrides",
      type: "object",
      title: "Overrides",
      description:
        "Override the settings from the donation widget configuration for this inline widget, non-overridden settings will be inherited from the donation widget configuration",
      fields: [
        {
          name: "default_donation_type",
          title: "Default donation type",
          type: "string",
          options: {
            list: ["single", "monthly"],
          },
        },
        {
          name: "amount_context",
          title: "Donation amount inputs context",
          type: "object",
          description: "Preset amounts are only used if there is only one cause area",
          fields: [
            {
              name: "preset_amounts_recurring",
              title: "Preset amounts for recurring donations",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      title: "Value",
                      name: "amount",
                      type: "number",
                    },
                    {
                      title: "Subtext",
                      name: "subtext",
                      type: "string",
                    },
                  ],
                  preview: {
                    select: {
                      title: "amount",
                      subtitle: "subtext",
                    },
                  },
                },
              ],
            },
            {
              name: "preset_amounts_single",
              title: "Preset amounts for single donations",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      title: "Value",
                      name: "amount",
                      type: "number",
                    },
                    {
                      title: "Subtext",
                      name: "subtext",
                      type: "string",
                    },
                  ],
                  preview: {
                    select: {
                      title: "amount",
                      subtitle: "subtext",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          name: "prefilled_sum",
          title: "Prefilled amount",
          type: "number",
        },
        {
          name: "prefilled_distribution",
          type: "array",
          title: "Prefilled distribution",
          // This won't actually be used since we have a custom input component
          of: [
            {
              type: "object",
              fields: [
                { name: "type", type: "string" },
                { name: "id", type: "number" },
                { name: "causeAreaId", type: "number" },
                { name: "percentage", type: "number" },
                { name: "name", type: "string" },
              ],
            },
          ],
          components: {
            input: DistributionInput,
          },
        },
      ],
    },
  ],
};
