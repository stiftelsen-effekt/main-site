import { defineField, defineType } from "sanity";

export default defineType({
  name: "wealthcalculatorimpact",
  type: "document",
  title: "Wealth Calculator Impact",
  fields: [
    defineField({
      name: "header",
      type: "string",
      title: "Header",
    }),
    defineField({
      name: "description_template_string",
      type: "text",
      title: "Description Template String",
      rows: 3,
      description:
        'This is a template string that will be used to generate the description. The template string should contain a single placeholder, which will be replaced with the donation amount. For example "Med {donation} kroner i året donert til effektiv bistand kan du påvirke mange liv der det trengs mest du kan for eksempel bidra med myggnett, A-vitamin tilskudd eller vaksinering." will be replaced with "Med 1000 kroner i året donert til effektiv bistand kan du påvirke mange liv der det trengs mest du kan for eksempel bidra med myggnett, A-vitamin tilskudd eller vaksinering."',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "button_text",
      type: "string",
      title: "Button Text",
      description: "Text for the button that opens the donation widget.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "intervention_configuration",
      type: "object",
      title: "Intervention Configuration",
      fields: [
        defineField({
          name: "output_configuration",
          type: "reference",
          to: [{ type: "interventionwidgetoutputconfiguration" }],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "header",
    },
  },
});
