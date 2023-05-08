export default {
  name: "vipps",
  type: "document",
  title: "Vipps payment provider",
  fields: [
    {
      name: "agreement_page",
      title: "Agreement page",
      type: "reference",
      to: [{ type: "vippsagreement" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "anonymous_page",
      title: "Anonymous Vipps page",
      type: "reference",
      to: [{ type: "vipps-anonymous" }],
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Vipps",
      };
    },
  },
} as const;
