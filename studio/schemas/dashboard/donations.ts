import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Donations",
  name: "donations",
  type: "document",
  fields: [
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
