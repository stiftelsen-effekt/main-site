import { User } from "react-feather";

export default {
  type: "document",
  name: "dkmembershipwidget",
  title: "DK Membership Widget",
  icon: User,
  fields: [
    {
      name: "membership_fee_text",
      title: "Membership Fee Text",
      type: "string",
      description: "Text to display for the membership fee.",
      validation: (Rule: any) => Rule.required(),
    },
  ],
};
