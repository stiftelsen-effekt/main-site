import { defineType, defineField } from "sanity";

export default defineType({
  name: "donationstabledetailsconfiguration",
  description: "Configuration for the expanded view of the donations table",
  type: "object",
  fields: [
    defineField({
      name: "impact_estimate_header",
      title: "Impact estimate header",
      type: "string",
    }),
    defineField({
      name: "impact_estimate_explanation_title",
      title: "Impact estimate explanation title",
      type: "string",
    }),
    defineField({
      name: "impact_estimate_explanation_text",
      title: "Impact estimate explanation text",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "impact_estimate_explanation_links",
      title: "Impact estimate explanation links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
    defineField({
      name: "impact_items_configuration",
      title: "Impact items configuration",
      type: "object",
      fields: [
        defineField({
          name: "smart_distribution_label",
          title: "Smart distribution label",
          type: "string",
        }),
        defineField({
          name: "operations_label",
          title: "Operations label",
          type: "string",
        }),
        defineField({
          name: "impact_item_configuration",
          title: "Impact item configuration",
          type: "object",
          fields: [
            defineField({
              name: "output_subheading_format_string",
              title: "Output subheading format string",
              type: "string",
              description:
                "Use {{sum}} insert the donation sum to the organization, and {{org}} to insert the organization name",
            }),
            defineField({
              name: "missing_evaluation_header",
              title: "Missing evaluation header",
              type: "string",
            }),
            defineField({
              name: "missing_impact_evaluation_text",
              title: "Missing impact evaluation text",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "about_org_link_title_format_string",
              title: "About org link title format string",
              type: "string",
              description: "Use {{org}} to insert the organization name",
            }),
            defineField({
              name: "about_org_link_url_format_string",
              title: "About org link url format string",
              type: "string",
              description: "Use {{org}} to insert the organization name",
            }),
          ],
        }),
      ],
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
