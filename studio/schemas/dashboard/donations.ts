import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Donations",
  name: "donations",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "year_menu_total_title",
      title: "Year Menu Total Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "aggregate_estimated_impact",
      title: "Aggregate estimated impact configuration",
      type: "reference",
      to: [{ type: "aggregateestimatedimpact" }],
    },
    {
      name: "sum_all_times_template_string",
      title: "Sum all times template string",
      type: "string",
      description: "Use {{year}} to insert the first year of donations",
    },
    {
      name: "sum_year_template_string",
      title: "Sum year template string",
      type: "string",
      description: "Use {{year}} to insert the year of donations",
    },
    {
      name: "desktop_donations_table_configuration",
      title: "Desktop donations table configuration",
      type: "donationstableconfiguration",
    },
    {
      name: "mobile_donations_table_configuration",
      title: "Mobile donations table configuration",
      type: "donationstableconfiguration",
    },
    {
      name: "donations_details_configuration",
      title: "Donations table details configuration",
      description: "Configuration for the expanded view of the donations table",
      type: "object",
      fields: [
        {
          name: "impact_estimate_header",
          title: "Impact estimate header",
          type: "string",
        },
        {
          name: "impact_estimate_explanation_title",
          title: "Impact estimate explanation title",
          type: "string",
        },
        {
          name: "impact_estimate_explanation_text",
          title: "Impact estimate explanation text",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "impact_estimate_explanation_links",
          title: "Impact estimate explanation links",
          type: "array",
          of: [{ type: "link" }, { type: "navitem" }],
        },
        {
          name: "impact_items_configuration",
          title: "Impact items configuration",
          type: "object",
          fields: [
            {
              name: "smart_distribution_label",
              title: "Smart distribution label",
              type: "string",
            },
            {
              name: "operations_label",
              title: "Operations label",
              type: "string",
            },
            {
              name: "impact_item_configuration",
              title: "Impact item configuration",
              type: "object",
              fields: [
                {
                  name: "output_subheading_format_string",
                  title: "Output subheading format string",
                  type: "string",
                  description:
                    "Use {{sum}} insert the donation sum to the organization, and {{org}} to insert the organization name",
                },
                {
                  name: "missing_evaluation_header",
                  title: "Missing evaluation header",
                  type: "string",
                },
                {
                  name: "missing_impact_evaluation_text",
                  title: "Missing impact evaluation text",
                  type: "array",
                  of: [{ type: "block" }],
                },
                {
                  name: "about_org_link_title_format_string",
                  title: "About org link title format string",
                  type: "string",
                  description: "Use {{org}} to insert the organization name",
                },
                {
                  name: "about_org_link_url_format_string",
                  title: "About org link url format string",
                  type: "string",
                  description: "Use {{org}} to insert the organization name",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "donations",
      description: "Relative to dashboard",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
} as const;
