import { defineType, defineField } from "sanity";

export default defineType({
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
    defineField({
      name: "name",
      type: "string",
      title: "Name",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "abbriviation",
      type: "string",
      title: "Abbriviation",
    }),
    defineField({
      name: "oneliner",
      type: "string",
      title: "Oneliner",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "intervention_type",
      title: "Intervention type",
      type: "string",
      group: "intervention",
    }),
    defineField({
      name: "invervention_cost",
      title: "Intervention cost",
      type: "string",
      group: "intervention",
    }),
    defineField({
      name: "intervention_effect",
      title: "Intervention effect",
      type: "string",
      group: "intervention",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "links_header",
      title: "Links header",
      type: "string",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }],
    }),
    defineField({
      name: "widget_button",
      title: "Widget button",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
        }),
        defineField({
          name: "cause_area_id",
          title: "Cause area id",
          type: "number",
        }),
        defineField({
          name: "organization_id",
          title: "Organization id",
          type: "number",
        }),
      ],
    }),
    defineField({
      name: "organization_page",
      title: "Organization page",
      type: "reference",
      to: [{ type: "generic_page" }],
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
    }),
  ],
});
