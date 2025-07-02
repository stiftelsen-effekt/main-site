import { defineType, defineField } from "sanity";

export default defineType({
  name: "organizationmapping",
  type: "object",
  title: "Organization Mapping",
  fields: [
    defineField({
      name: "abbreviation",
      title: "Abbreviation",
      type: "string",
      description: "The organization abbreviation used in the API",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "The full organization name to display",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      abbreviation: "abbreviation",
      fullName: "fullName",
    },
    prepare({ abbreviation, fullName }: { abbreviation: string; fullName: string }) {
      return {
        title: `${abbreviation} → ${fullName}`,
      };
    },
  },
});
