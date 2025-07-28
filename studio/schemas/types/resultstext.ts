import { defineType, defineField } from "sanity";

export default defineType({
  name: "resultstext",
  type: "object",
  title: "Results Page Text Configuration",
  fields: [
    defineField({
      name: "currencySymbol",
      title: "Currency Symbol",
      type: "string",
      initialValue: "kr",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collectedFromDonorsText",
      title: "Collected From Donors Text",
      type: "string",
      description:
        "Text template for 'collected from X donors'. Use {count} as placeholder for number of donors.",
      initialValue: "samlet inn fra {count} givere",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdatedText",
      title: "Last Updated Text",
      type: "string",
      description: "Text template for last updated. Use {date} as placeholder for the date.",
      initialValue: "sist oppdatert {date}",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "impactEstimateText",
      title: "Impact Estimate Text",
      type: "string",
      description: "Text that introduces the impact estimates",
      initialValue: "Vi estimerer at dette har resultert i distribusjon av",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "andText",
      title: "And Text",
      type: "string",
      description: "Word for 'and' used in lists",
      initialValue: "og",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "readMoreDefaultText",
      title: "Read More Default Text",
      type: "string",
      description: "Default text for read more links when no title is specified",
      initialValue: "Les mer:",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organizationsHeading",
      title: "Organizations Heading",
      type: "string",
      initialValue: "Organisasjoner",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organizationsDescription",
      title: "Organizations Description Template",
      type: "string",
      description:
        "Description template for organizations. Use {output} as placeholder for output type.",
      initialValue:
        "Donasjoner til anbefalte eller tidligere anbefalte organisasjoner som arbeider med {output}.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "directDonationsText",
      title: "Direct Donations Text",
      type: "string",
      description: "Text template for direct donations. Use {amount} as placeholder.",
      initialValue: "{amount} kr direkte fra donorer",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "smartDistributionText",
      title: "Smart Distribution Text",
      type: "string",
      description: "Text template for smart distribution. Use {amount} as placeholder.",
      initialValue: "{amount} kr via smart fordeling",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sparkline",
      title: "Sparkline",
      type: "object",
      fields: [
        defineField({
          name: "smartDistributionText",
          title: "Smart Distribution Sparkline Text",
          type: "string",
          description: "Text for smart distribution in sparkline",
        }),
        defineField({
          name: "directDonationsText",
          title: "Direct Donations Sparkline Text",
          type: "string",
          description: "Text for direct donations in sparkline",
        }),
      ],
    }),
    defineField({
      name: "normalizeYAxisText",
      title: "Normalize Y-Axis Text",
      type: "string",
      initialValue: "Standardiser y-akse",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "millionAbbreviation",
      title: "Million Abbreviation",
      type: "string",
      description: "Abbreviation for million used in charts",
      initialValue: "mill",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      type: "string",
      name: "table_label",
      title: "Table label",
      description: "The label for the table expander (if applicable)",
    }),
    defineField({
      type: "string",
      name: "table_close_label",
      title: "Table close label",
      description: "The label for the table close label (if applicable)",
    }),
    defineField({
      type: "object",
      name: "table_headers",
      title: "Table Headers",
      description: "Headers for the table for various graphs",
      fields: [
        {
          type: "cumulativedonationstableheaders",
          name: "cumulative_donations_table_headers",
          title: "Cumulative Donations Table Headers",
          description: "Headers for the cumulative donations table",
        },
        {
          type: "outputdonationstableheaders",
          name: "output_donations_table_headers",
          title: "Output Donations Table Headers",
          description: "Headers for the output donations table",
        },
      ],
    }),
    defineField({
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
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Results Page Text Configuration",
      };
    },
  },
});
