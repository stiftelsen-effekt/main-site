import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Tax deduction",
  name: "taxdeduction",
  type: "document",
  fields: [
    {
      name: "about_taxdeductions",
      title: "Om skattefradrag",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "about_taxdeductions_links",
      title: "Om skattefradrag lenker",
      type: "links",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "about",
      description: "Relative to tax page",
      validation: (Rule: any) => Rule.required().custom(isShallowSlug),
    },
  ],

  preview: {
    select: {
      title: "slug.current",
    },
  },
} as const;
