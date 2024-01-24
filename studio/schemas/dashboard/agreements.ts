import { isShallowSlug } from "../../validators/isShallowSlug";

export default {
  title: "Agreements",
  name: "agreements",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "active_list_configuration",
      title: "Active List Configuration",
      type: "agreementactivelistconfiguration",
    },
    {
      name: "inactive_list_configuration",
      title: "Inactive List Configuration",
      type: "agreementinactivelistconfiguration",
    },
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
