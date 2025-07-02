import { defineType, defineField } from "sanity";

export default defineType({
  name: "referralstabletext",
  type: "object",
  title: "Referrals Table Text",
  fields: [
    defineField({
      name: "yearColumnHeader",
      title: "Year Column Header",
      type: "string",
      initialValue: "År",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "typeColumnHeader",
      title: "Type Column Header",
      type: "string",
      initialValue: "Type",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donationSumColumnHeader",
      title: "Donation Sum Column Header",
      type: "string",
      initialValue: "Sum donasjoner",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donationCountColumnHeader",
      title: "Donation Count Column Header",
      type: "string",
      initialValue: "Antall donasjoner",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Referrals Table Text",
      };
    },
  },
});
