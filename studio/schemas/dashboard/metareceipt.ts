import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Meta receipt",
  name: "metareceipt",
  type: "document",
  fields: [
    {
      name: "facebook_description",
      title: "Hvordan finne betalings-ID",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "facebook_description_links",
      title: "Hvordan finne betalings-ID lenker",
      type: "links",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "facebook-instagram",
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
