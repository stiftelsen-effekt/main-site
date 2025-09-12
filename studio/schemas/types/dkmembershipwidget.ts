import { User } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "dkmembershipwidget",
  title: "DK Membership Widget",
  icon: User,
  fields: [
    defineField({
      name: "configuration",
      title: "Configuration",
      type: "object",
      description: "Configuration settings for the membership widget.",
      fields: [
        defineField({
          name: "membership_fee_text",
          title: "Membership Fee Text",
          type: "string",
          description: "Text to display for the membership fee.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "country_label",
          title: "Country Label",
          type: "string",
          description: "Label for the country field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "name_label",
          title: "Name Label",
          type: "string",
          description: "Label for the name field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "email_label",
          title: "Email Label",
          type: "string",
          description: "Label for the email field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "address_label",
          title: "Address Label",
          type: "string",
          description: "Label for the address field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "postcode_label",
          title: "Postcode Label",
          type: "string",
          description: "Label for the postcode field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "city_label",
          title: "City Label",
          type: "string",
          description: "Label for the city field.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "tin_label",
          title: "TIN Label",
          type: "string",
          description:
            "Label for the Tax Identification Number (TIN) field. This is used in many countries to identify individuals and businesses for tax purposes.",
        }),
        defineField({
          name: "tin_denmark_label",
          title: "TIN Denmark Label",
          type: "string",
          description:
            "Label for the TIN field specifically in Denmark, where it is often referred to as CPR number.",
        }),
        defineField({
          name: "birthday_label",
          title: "Birthday Label",
          type: "string",
          description: "Label for the birthday field, which is often required in membership forms.",
        }),
        defineField({
          name: "submit_button_text",
          title: "Submit Button Text",
          type: "string",
          description: "Text to display on the submit button of the membership form.",
        }),
        defineField({
          name: "cpr_suspicious_message",
          title: "CPR Suspicious Message",
          type: "string",
          description: "Message to display when the CPR number entered is suspicious or invalid.",
        }),
        defineField({
          name: "cpr_invalid_message",
          title: "CPR Invalid Message",
          type: "string",
          description: "Message to display when the CPR number entered is invalid.",
        }),
        defineField({
          name: "field_required_message",
          title: "Field Required Message",
          type: "string",
          description: "Message to display when a required field is not filled out.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "submitting_message",
          title: "Submitting Message",
          type: "string",
          description: "Message to display while the form is being submitted.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "failed submission message",
          title: "Failed submission response message",
          type: "string",
          description: "Message to display if the submission failed.",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
});
