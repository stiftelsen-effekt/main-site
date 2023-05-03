import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Agreements",
  name: "agreements",
  type: "document",
  fields: [
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "agreements",
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
