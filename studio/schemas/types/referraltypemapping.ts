import { defineType, defineField } from "sanity";

export default defineType({
  name: "referraltypemapping",
  type: "object",
  title: "Referral Type Mapping",
  fields: [
    defineField({
      name: "apiKey",
      title: "API Key",
      type: "string",
      description: "The referral type key used in the API",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayLabel",
      title: "Display Label",
      type: "string",
      description: "The label to display for this referral type",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      apiKey: "apiKey",
      displayLabel: "displayLabel",
    },
    prepare({ apiKey, displayLabel }: { apiKey: string; displayLabel: string }) {
      return {
        title: `${apiKey} → ${displayLabel}`,
      };
    },
  },
});
