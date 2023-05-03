import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Tax units",
  name: "taxunits",
  type: "document",
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "taxunits",
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
