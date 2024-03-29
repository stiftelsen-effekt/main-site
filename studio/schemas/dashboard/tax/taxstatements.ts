import { isShallowSlug } from "../../../validators/isShallowSlug";

export default {
  title: "Tax statements",
  name: "taxstatements",
  type: "object",

  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "aggregate_estimated_impact",
      title: "Aggregate estimated impact configuration",
      type: "reference",
      to: [{ type: "aggregateestimatedimpact" }],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "annual-statements",
      description: "Relative to tax page",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],
} as const;
