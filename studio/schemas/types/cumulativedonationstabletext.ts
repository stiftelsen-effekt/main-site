import { defineType, defineField } from "sanity";

export default defineType({
  name: "cumulativedonationstabletext",
  type: "object",
  title: "Cumulative Donations Table Text",
  fields: [
    defineField({
      name: "dateColumnHeader",
      title: "Date Column Header",
      type: "string",
      initialValue: "Dato (ISO 8601)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dayOfYearColumnHeader",
      title: "Day of Year Column Header",
      type: "string",
      initialValue: "Dag i året",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cumulativeSumColumnHeader",
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
