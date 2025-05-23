export default {
  name: "outputmapping",
  type: "object",
  title: "Output Type Mapping",
  fields: [
    {
      name: "sanityKey",
      title: "Sanity Key",
      type: "string",
      description: "The key used in Sanity",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "dataKey",
      title: "Data Key",
      type: "string",
      description: "The corresponding key in the API data",
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      sanityKey: "sanityKey",
      dataKey: "dataKey",
    },
    prepare({ sanityKey, dataKey }: { sanityKey: string; dataKey: string }) {
      return {
        title: `${sanityKey} → ${dataKey}`,
      };
    },
  },
} as const;
