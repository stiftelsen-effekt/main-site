import { BarChart2 } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "fundraiserchart",
  type: "object",
  title: "Fundraiser Chart",
  icon: BarChart2,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
    }),
    defineField({
      name: "fundraisers",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              type: "string",
              title: "Name",
              description: "Name shown in bar chart",
            }),
            defineField({
              name: "fundraiser_page",
              type: "reference",
              to: [{ type: "generic_page" }],
            }),
            defineField({
              name: "fundraiser_id",
              type: "number",
              title: "Fundraiser ID",
              description: "ID of the fundraiser in the database",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "caption_template",
      type: "string",
      title: "Chart caption template",
      description: "Chart caption with last updated time specified with {lastUpdated}",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      fundraiser1name: "fundraisers.0.name",
      fundraiser2name: "fundraisers.1.name",
      fundraiser3name: "fundraisers.2.name",
      fundraiser4name: "fundraisers.3.name",
      fundraiser5name: "fundraisers.4.name",
    },
    prepare: (selection: any) => {
      const fundraiserNames = [
        selection.fundraiser1name,
        selection.fundraiser2name,
        selection.fundraiser3name,
        selection.fundraiser4name,
        selection.fundraiser5name,
      ].filter(Boolean);
      const fullSubtitle = fundraiserNames.join(", ");
      const subtitle =
        fullSubtitle.length > 60 ? fullSubtitle.substring(0, 60) + "..." : fullSubtitle;

      return {
        title: selection.title,
        subtitle: subtitle,
      };
    },
  },
});
