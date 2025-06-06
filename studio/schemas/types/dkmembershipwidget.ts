import { User } from "react-feather";

export default {
  type: "document",
  name: "dkmembershipwidget",
  title: "DK Membership Widget",
  icon: User,
  fields: [
    {
      name: "configuration",
      title: "Configuration",
      type: "object",
      description: "Configuration settings for the membership widget.",
      fields: [
        {
          name: "membership_fee_text",
          title: "Membership Fee Text",
          type: "string",
          description: "Text to display for the membership fee.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "country_label",
          title: "Country Label",
          type: "string",
          description: "Label for the country field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "name_label",
          title: "Name Label",
          type: "string",
          description: "Label for the name field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "email_label",
          title: "Email Label",
          type: "string",
          description: "Label for the email field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "address_label",
          title: "Address Label",
          type: "string",
          description: "Label for the address field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "postcode_label",
          title: "Postcode Label",
          type: "string",
          description: "Label for the postcode field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "city_label",
          title: "City Label",
          type: "string",
          description: "Label for the city field.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "tin_label",
          title: "TIN Label",
          type: "string",
          description:
            "Label for the Tax Identification Number (TIN) field. This is used in many countries to identify individuals and businesses for tax purposes.",
        },
        {
          name: "tin_denmark_label",
          title: "TIN Denmark Label",
          type: "string",
          description:
            "Label for the TIN field specifically in Denmark, where it is often referred to as CPR number.",
        },
        {
          name: "birthday_label",
          title: "Birthday Label",
          type: "string",
          description: "Label for the birthday field, which is often required in membership forms.",
        },
        {
          name: "submit_button_text",
          title: "Submit Button Text",
          type: "string",
          description: "Text to display on the submit button of the membership form.",
        },
        {
          name: "cpr_suspicious_message",
          title: "CPR Suspicious Message",
          type: "string",
          description: "Message to display when the CPR number entered is suspicious or invalid.",
        },
        {
          name: "cpr_invalid_message",
          title: "CPR Invalid Message",
          type: "string",
          description: "Message to display when the CPR number entered is invalid.",
        },
        {
          name: "field_required_message",
          title: "Field Required Message",
          type: "string",
          description: "Message to display when a required field is not filled out.",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "submitting_message",
          title: "Submitting Message",
          type: "string",
          description: "Message to display while the form is being submitted.",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
  ],
};
