import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Profile",
  name: "profile",
  type: "document",
  fields: [
    {
      name: "tax",
      title: "Tax deduction",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "data",
      title: "Data policy",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "profile",
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
