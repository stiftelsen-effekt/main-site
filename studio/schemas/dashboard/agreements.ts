import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../validators/isShallowSlug";

export default defineType({
  title: "Agreements",
  name: "agreements",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pending_agreements_box_configuration",
      title: "Pending Agreements Box Configuration",
      type: "object",
      fields: [
        defineField({
          name: "single_pending_agreement_title",
          title: "Single Pending Agreement Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "multiple_pending_agreements_title_template",
          title: "Multiple Pending Agreements Title Template",
          type: "string",
          description:
            "Use {{count}} to insert the number of pending agreements, e.g. 'You have {{count}} pending agreements'",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "single_pending_agreement_text",
          title: "Single Pending Agreement Text",
          type: "string",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "multiple_pending_agreements_text_template",
          title: "Multiple Pending Agreements Text Template",
          type: "string",
          description:
            "Use {{count}} to insert the number of pending agreements, e.g. 'You have {{count}} pending agreements'",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "active_list_configuration",
      title: "Active List Configuration",
      type: "agreementlistconfiguration",
    }),
    defineField({
      name: "inactive_list_configuration",
      title: "Inactive List Configuration",
      type: "agreementlistconfiguration",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "agreements",
      description: "Relative to dashboard",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
  preview: {
    select: {
      title: "slug.current",
    },
  },
});
