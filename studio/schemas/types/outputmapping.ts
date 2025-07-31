import { defineType, defineField } from "sanity";
import ApiOutputSelector from "../../components/apiOutputSelector";
import { outputTypeList } from "./results/_outputtype";

export default defineType({
  name: "outputmapping",
  type: "object",
  title: "Output Type Mapping",
  fields: [
    defineField({
      name: "sanityKey",
      title: "Sanity Key",
      type: "string",
      options: {
        list: outputTypeList,
      },
      description: "The key used in Sanity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dataKey",
      title: "Data Key from API",
      type: "string",
      description: "The corresponding key in the API data - fetched from live API",
      validation: (Rule) => Rule.required(),
      components: {
        input: ApiOutputSelector,
      },
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
