import { RefreshCw } from "react-feather";

export default {
  type: "document",
  name: "dkrenewpayment",
  title: "DK Renew Payment",
  icon: RefreshCw,
  fields: [
    {
      name: "loading_text",
      title: "Loading Text",
      type: "string",
      description: "Text to display while the renew payment link is loading.",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {},
    prepare({}: {}) {
      return {
        title: "DK Renew Payment",
      };
    },
  },
};
