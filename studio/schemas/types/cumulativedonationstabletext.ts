export default {
  name: "cumulativedonationstabletext",
  type: "object",
  title: "Cumulative Donations Table Text",
  fields: [
    {
      name: "dateColumnHeader",
      title: "Date Column Header",
      type: "string",
      initialValue: "Dato (ISO 8601)",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "dayOfYearColumnHeader",
      title: "Day of Year Column Header",
      type: "string",
      initialValue: "Dag i året",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "cumulativeSumColumnHeader",
      title: "Cumulative Sum Column Header",
      type: "string",
      initialValue: "Kumulativ sum",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Cumulative Donations Table Text",
      };
    },
  },
} as const;
