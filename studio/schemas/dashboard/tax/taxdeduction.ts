import { isShallowSlug } from "../../../validators/isShallowSlug";

export default {
  title: "About tax deductions",
  name: "abouttaxdeductions",
  type: "object",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "about",
      title: "Om skattefradrag",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "links",
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
} as const;
