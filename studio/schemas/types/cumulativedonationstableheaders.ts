import { defineType, defineField } from "sanity";

export default defineType({
  name: "cumulativedonationstableheaders",
  type: "object",
  title: "Cumulative Donations Table Headers",
  fields: [
    defineField({
      name: "date",
      title: "Date Column Header",
      type: "string",
      initialValue: "Dato (ISO 8601)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "day_of_year",
      title: "Day of Year Column Header",
      type: "string",
      initialValue: "Dag i året",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cumulative_sum",
      title: "Cumulative Sum Column Header",
      type: "string",
      initialValue: "Kumulativ sum",
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
