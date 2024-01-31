export default {
  type: "object",
  name: "agreementlistdetailsconfiguration",
  title: "Agreement list details configuration",
  fields: [
    {
      name: "save_button_text",
      title: "Save button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "cancel_button_text",
      title: "Cancel agreement button text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "date_selector_configuration",
      title: "Date selector configuration",
      type: "reference",
      to: [{ type: "dateselectorconfig" }],
    },
    {
      name: "loading_text",
      title: "Loading text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "error_text",
      title: "Error text",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "toasts_configuration",
      title: "Toasts configuration",
      type: "object",
      fields: [
        {
          name: "failure_text",
          title: "Failure text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "success_text",
          title: "Success text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "no_change_text",
          title: "No change text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "agreement_cancel_lightbox",
      title: "Agreement cancel lightbox",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "text",
          title: "Text",
          type: "string",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "withdrawal_warning_text",
          title: "Withdrawal warning text",
          type: "string",
          description:
            "For AutoGiro and AvtaleGiro, we have a warning text that is shown when the user cancels the agreement if the withdrawal date is close.",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "distribution_configuration",
      title: "Distribution configuration",
      type: "object",
      fields: [
        {
          name: "smart_distribution_label",
          title: "Smart distribution label",
          type: "string",
        },
      ],
    },
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
};
