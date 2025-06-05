export default {
  name: "resultstext",
  type: "object",
  title: "Results Page Text Configuration",
  fields: [
    {
      name: "currencySymbol",
      title: "Currency Symbol",
      type: "string",
      initialValue: "kr",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "collectedFromDonorsText",
      title: "Collected From Donors Text",
      type: "string",
      description:
        "Text template for 'collected from X donors'. Use {count} as placeholder for number of donors.",
      initialValue: "samlet inn fra {count} givere",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "lastUpdatedText",
      title: "Last Updated Text",
      type: "string",
      description: "Text template for last updated. Use {date} as placeholder for the date.",
      initialValue: "sist oppdatert {date}",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "impactEstimateText",
      title: "Impact Estimate Text",
      type: "string",
      description: "Text that introduces the impact estimates",
      initialValue: "Vi estimerer at dette har resultert i distribusjon av",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "andText",
      title: "And Text",
      type: "string",
      description: "Word for 'and' used in lists",
      initialValue: "og",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "readMoreDefaultText",
      title: "Read More Default Text",
      type: "string",
      description: "Default text for read more links when no title is specified",
      initialValue: "Les mer:",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "organizationsHeading",
      title: "Organizations Heading",
      type: "string",
      initialValue: "Organisasjoner",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "organizationsDescription",
      title: "Organizations Description Template",
      type: "string",
      description:
        "Description template for organizations. Use {output} as placeholder for output type.",
      initialValue:
        "Donasjoner til anbefalte eller tidligere anbefalte organisasjoner som arbeider med {output}.",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "directDonationsText",
      title: "Direct Donations Text",
      type: "string",
      description: "Text template for direct donations. Use {amount} as placeholder.",
      initialValue: "{amount} kr direkte fra donorer",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "smartDistributionText",
      title: "Smart Distribution Text",
      type: "string",
      description: "Text template for smart distribution. Use {amount} as placeholder.",
      initialValue: "{amount} kr via smart fordeling",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "sparkline",
      title: "Sparkline",
      type: "object",
      fields: [
        {
          name: "smartDistributionText",
          title: "Smart Distribution Sparkline Text",
          type: "string",
          description: "Text for smart distribution in sparkline",
        },
        {
          name: "directDonationsText",
          title: "Direct Donations Sparkline Text",
          type: "string",
          description: "Text for direct donations in sparkline",
        },
      ],
    },
    {
      name: "normalizeYAxisText",
      title: "Normalize Y-Axis Text",
      type: "string",
      initialValue: "Standardiser y-akse",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "millionAbbreviation",
      title: "Million Abbreviation",
      type: "string",
      description: "Abbreviation for million used in charts",
      initialValue: "mill",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "locale",
      title: "Locale",
      type: "string",
      description: "Locale for number and currency formatting",
      initialValue: "no-NB",
      options: {
        list: [
          { title: "Norwegian (Bokmål)", value: "no-NB" },
          { title: "Norwegian (Nynorsk)", value: "no-NN" },
          { title: "Swedish", value: "sv-SE" },
          { title: "Danish", value: "da-DK" },
        ],
        layout: "dropdown",
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    prepare() {
      return {
        title: "Results Page Text Configuration",
      };
    },
  },
} as const;
