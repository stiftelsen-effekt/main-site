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
      name: "abbriviation",
      type: "string",
      title: "Abbriviation",
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
      name: "intervention_type",
      title: "Intervention type",
      type: "string",
      group: "intervention",
    },
    {
      name: "invervention_cost",
      title: "Intervention cost",
      type: "string",
      group: "intervention",
    },
    {
      name: "intervention_effect",
      title: "Intervention effect",
      type: "string",
      group: "intervention",
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
          name: "cause_area_id",
          title: "Cause area id",
          type: "number",
        },
        {
          name: "organization_id",
          title: "Organization id",
          type: "number",
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
