export default {
  name: "referralstabletext",
  type: "object",
  title: "Referrals Table Text",
  fields: [
    {
      name: "yearColumnHeader",
      title: "Year Column Header",
      type: "string",
      initialValue: "År",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "typeColumnHeader",
      title: "Type Column Header",
      type: "string",
      initialValue: "Type",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "donationSumColumnHeader",
      title: "Donation Sum Column Header",
      type: "string",
      initialValue: "Sum donasjoner",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "donationCountColumnHeader",
      title: "Donation Count Column Header",
      type: "string",
      initialValue: "Antall donasjoner",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Referrals Table Text",
      };
    },
  },
} as const;
