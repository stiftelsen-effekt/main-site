import { isShallowSlug } from "../../../validators/isShallowSlug";

export default {
  title: "Tax units",
  name: "taxunits",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
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
} as const;
