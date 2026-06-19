import { defineType, defineField } from "sanity";

export default defineType({
  name: "outputdonationstableheaders",
  type: "object",
  title: "Cumulative Donations Table Headers",
  fields: [
    defineField({
      name: "period",
      title: "Period Column Header (e.g. 22-12)",
      type: "string",
      initialValue: "Periode",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization Column Header (e.g. AMF)",
      type: "string",
      initialValue: "Organisasjon",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "distribution",
      title: "Distribution Column Header (smart distribution, direct donations)",
      type: "string",
      initialValue: "Fordeling",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sum_donations",
      title: "Sum Donations Column Header (e.g. 1000)",
      type: "string",
      initialValue: "Sum donasjoner",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Cumulative Donations Table Text",
      };
    },
  },
});
