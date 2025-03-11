import { OrganizationSelector } from "../../components/organizationInput";

export default {
  name: "organization",
  type: "document",
  title: "Organization",
  groups: [
    {
      name: "intervention",
      title: "Intervention",
    },
  ],
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    },
    {
      name: "oneliner",
      type: "string",
      title: "Oneliner",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "logo",
      title: "Logo",
      type: "image",
    },
    {
      name: "links_header",
      title: "Links header",
      type: "string",
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }],
    },
    {
      name: "database_ids",
      title: "Database ids",
      type: "object",
      description:
        "Set the cause area and organization id for the donation coresponding to the ones used in the database. Used for the widget button",
      fields: [
        {
          name: "cause_area_id",
          title: "Impact id",
          type: "number",
        },
        {
          name: "organization_id",
          title: "Organization id",
          type: "number",
        },
      ],
      validation: (Rule: any) => {
        return Rule.required().custom((fields: any) => {
          if (fields.cause_area_id && fields.organization_id) {
            return true;
          }
          return "Both cause_area_id and organization_id must be set";
        });
      },
      components: {
        input: OrganizationSelector,
      },
    },
    {
      name: "widget_button",
      title: "Widget button",
      type: "object",
      fields: [
        {
          name: "label",
          title: "Label",
          type: "string",
        },
        {
          name: "display",
          title: "Display",
          type: "boolean",
          description:
            "Whether to display the widget button, which opens the widget with the organization prefilled to 100% of the donation",
        },
      ],
      hidden: ({ parent }: any) =>
        !parent.database_ids ||
        !parent.database_ids.cause_area_id ||
        !parent.database_ids.organization_id,
    },
    {
      name: "intervention",
      title: "Intervention",
      type: "object",
      fields: [
        {
          name: "abbreviation",
          type: "string",
          title: "Abbreviation",
          description: "Used to fetch impact estimates from the impact API",
        },
        {
          name: "type",
          type: "string",
          title: "Intervention type",
          description:
            "The type of intervention, output to just get the cost per output in local currency, percentage to get the percantage that goes to the intervention (e.g. cash transfers), and scaled_output to get the cost per output scaled to some constant (e.g. 2 vitamin-A supplements to cover a child for a year)",
          options: {
            list: [
              { title: "Output", value: "output" },
              { title: "Percentage", value: "percentage" },
              { title: "Scaled output", value: "scaled_output" },
            ],
          },
        },
        {
          name: "scaling_factor",
          type: "number",
          title: "Intervention scaling factor",
          description: "The scaling factor to use for scaled_output interventions",
          hidden: ({ parent }: any) => parent && parent.type !== "scaled_output",
        },
        {
          name: "effect",
          type: "string",
          title: "Intervention effect",
        },
      ],
    },
    {
      name: "organization_page",
      title: "Organization page",
      type: "reference",
      to: [{ type: "generic_page" }],
    },
    {
      name: "active",
      title: "Active",
      type: "boolean",
    },
  ],
} as const;
