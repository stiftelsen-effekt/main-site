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
      name: "pending_agreements_box_configuration",
      title: "Pending Agreements Box Configuration",
      type: "object",
      fields: [
        {
          name: "single_pending_agreement_title",
          title: "Single Pending Agreement Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "multiple_pending_agreements_title_template",
          title: "Multiple Pending Agreements Title Template",
          type: "string",
          description:
            "Use {{count}} to insert the number of pending agreements, e.g. 'You have {{count}} pending agreements'",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "single_pending_agreement_text",
          title: "Single Pending Agreement Text",
          type: "string",
          lines: 3,
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "multiple_pending_agreements_text_template",
          title: "Multiple Pending Agreements Text Template",
          type: "string",
          description:
            "Use {{count}} to insert the number of pending agreements, e.g. 'You have {{count}} pending agreements'",
          lines: 3,
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "active_list_configuration",
      title: "Active List Configuration",
      type: "agreementlistconfiguration",
    },
    {
      name: "inactive_list_configuration",
      title: "Inactive List Configuration",
      type: "agreementlistconfiguration",
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
