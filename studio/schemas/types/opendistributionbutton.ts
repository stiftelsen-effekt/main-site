import { defineType, defineField, Rule } from "sanity";
import { MousePointer } from "react-feather";

export default defineType({
  name: "opendistributionbutton",
  type: "document",
  title: "Open distribution button",
  icon: MousePointer,
  fields: [
    defineField({
      name: "text",
      type: "string",
      title: "Text",
    }),
    defineField({
      name: "organization",
      type: "reference",
      to: [{ type: "organization" }],
      title: "Organization",
    }),
    defineField({
      name: "display_output_info",
      type: "boolean",
      title: "Display output info",
    }),
    defineField({
      name: "inverted",
      type: "boolean",
      title: "Inverted",
    }),
    defineField({
      name: "distribution_cause_areas",
      type: "array",
      title: "Distribution cause areas",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "cause_area_id",
              type: "number",
              title: "Cause area ID",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "cause_area_percentage",
              type: "number",
              title: "Cause area percentage",
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: "cause_area_default_distribution",
              type: "boolean",
              title: "Cause area default distribution",
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  if (value && (context.parent as any).cause_area_organizations.length > 0) {
                    return "Cause area default distribution cannot be set when cause area organizations are set";
                  }
                  return true;
                }),
            }),
            defineField({
              name: "cause_area_organizations",
              type: "array",
              title: "Cause area organizations",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "organization_id",
                      type: "number",
                      title: "Organization ID",
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "organization_percentage",
                      type: "number",
                      title: "Organization percentage",
                      validation: (Rule) => Rule.required().min(0).max(100),
                      description: "The percentage for the organization within the cause area",
                    }),
                  ],
                },
              ],
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const sum = (value as any[]).reduce(
                    (acc, item) => acc + item.organization_percentage,
                    0,
                  );
                  if (sum !== 100) {
                    return "The sum of the organization percentages must be 100";
                  }
                  return true;
                }),
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const sum = (value as any[]).reduce((acc, item) => acc + item.cause_area_percentage, 0);
          if (sum !== 100) {
            return "The sum of the cause area percentages must be 100";
          }
          return true;
        }),
    }),
  ],
});
