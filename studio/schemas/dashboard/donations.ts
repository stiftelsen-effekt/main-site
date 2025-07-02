import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../validators/isShallowSlug";

export default defineType({
  title: "Donations",
  name: "donations",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year_menu_total_title",
      title: "Year Menu Total Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aggregate_estimated_impact",
      title: "Aggregate estimated impact configuration",
      type: "reference",
      to: [{ type: "aggregateestimatedimpact" }],
    }),
    defineField({
      name: "sum_all_times_template_string",
      title: "Sum all times template string",
      type: "string",
      description: "Use {{year}} to insert the first year of donations",
    }),
    defineField({
      name: "sum_year_template_string",
      title: "Sum year template string",
      type: "string",
      description: "Use {{year}} to insert the year of donations",
    }),
    defineField({
      name: "desktop_donations_table_configuration",
      title: "Desktop donations table configuration",
      type: "donationstableconfiguration",
    }),
    defineField({
      name: "mobile_donations_table_configuration",
      title: "Mobile donations table configuration",
      type: "donationstableconfiguration",
    }),
    defineField({
      name: "donations_details_configuration",
      title: "Donations table details configuration",
      type: "donationstabledetailsconfiguration",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "donations",
      description: "Relative to dashboard",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
});
