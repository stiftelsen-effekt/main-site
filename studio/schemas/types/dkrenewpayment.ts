import { RefreshCw } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  type: "document",
  name: "dkrenewpayment",
  title: "DK Renew Payment",
  icon: RefreshCw,
  fields: [
    defineField({
      name: "loading_text",
      title: "Loading Text",
      type: "string",
      description: "Text to display while the renew payment link is loading.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {},
    prepare({}: {}) {
      return {
        title: "DK Renew Payment",
      };
    },
  },
});
