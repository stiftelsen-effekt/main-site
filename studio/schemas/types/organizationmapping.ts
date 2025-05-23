export default {
  name: "organizationmapping",
  type: "object",
  title: "Organization Mapping",
  fields: [
    {
      name: "abbreviation",
      title: "Abbreviation",
      type: "string",
      description: "The organization abbreviation used in the API",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fullName",
      title: "Full Name",
      type: "string",
      description: "The full organization name to display",
      validation: (Rule: any) => Rule.required(),
    },
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
} as const;
