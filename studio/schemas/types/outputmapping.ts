import { defineType, defineField } from "sanity";

export default defineType({
  name: "outputmapping",
  type: "object",
  title: "Output Type Mapping",
  fields: [
    defineField({
      name: "sanityKey",
      title: "Sanity Key",
      type: "string",
      description: "The key used in Sanity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dataKey",
      title: "Data Key",
      type: "string",
      description: "The corresponding key in the API data",
      validation: (Rule) => Rule.required(),
    }),
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
});
