export default {
  name: "referraltypemapping",
  type: "object",
  title: "Referral Type Mapping",
  fields: [
    {
      name: "apiKey",
      title: "API Key",
      type: "string",
      description: "The referral type key used in the API",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "displayLabel",
      title: "Display Label",
      type: "string",
      description: "The label to display for this referral type",
      validation: (Rule: any) => Rule.required(),
    },
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
} as const;
