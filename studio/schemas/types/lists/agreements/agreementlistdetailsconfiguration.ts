import { defineType, defineField } from "sanity";

export default defineType({
  type: "object",
  name: "agreementlistdetailsconfiguration",
  title: "Agreement list details configuration",
  fields: [
    defineField({
      name: "save_button_text",
      title: "Save button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cancel_button_text",
      title: "Cancel agreement button text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date_selector_configuration",
      title: "Date selector configuration",
      type: "reference",
      to: [{ type: "dateselectorconfig" }],
    }),
    defineField({
      name: "loading_text",
      title: "Loading text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "error_text",
      title: "Error text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "toasts_configuration",
      title: "Toasts configuration",
      type: "object",
      fields: [
        defineField({
          name: "failure_text",
          title: "Failure text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "success_text",
          title: "Success text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "no_change_text",
          title: "No change text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "agreement_cancel_lightbox",
      title: "Agreement cancel lightbox",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "withdrawal_warning_text",
          title: "Withdrawal warning text",
          type: "string",
          description:
            "For AutoGiro and AvtaleGiro, we have a warning text that is shown when the user cancels the agreement if the withdrawal date is close.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "agreement_cancelled_lightbox",
      title: "Agreement cancelled lightbox",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "text",
          title: "Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "lightbox_button_text",
          title: "Lightbox button text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "distribution_configuration",
      title: "Distribution configuration",
      type: "object",
      fields: [
        defineField({
          name: "smart_distribution_label",
          title: "Smart distribution label",
          type: "string",
        }),
      ],
    }),
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
});
