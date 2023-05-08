import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Vipps Anonymous",
  name: "vipps-anonymous",
  type: "document",
  fields: [
    {
      name: "header",
      title: "Header",
      type: "string",
      description: "The header text for the Vipps Anonymous page",
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      description: "The main content for the Vipps Anonymous page",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "vipps-anonymous",
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
