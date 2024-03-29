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
      type: "donationstabledetailsconfiguration",
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
