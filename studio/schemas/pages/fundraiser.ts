import { defineType, defineField } from "sanity";
import { FundraiserInput } from "../../components/fundraiserInput";

export default defineType({
  title: "Fundraiser",
  name: "fundraiser_page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "header_image",
      title: "Header image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fundraiser_image",
      title: "Fundraiser image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fundraiser_organization",
      title: "Fundraiser organization",
      type: "reference",
      to: [{ type: "organization" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fundraiser_organization_text_template",
      title: "Fundraiser organization text template",
      type: "string",
      description:
        "Template for the fundraiser organization text. Use {org} to insert the organization name.",
    }),
    defineField({
      name: "fundraiser_goal_config",
      title: "Fundraiser goal",
      type: "object",
      fields: [
        defineField({
          name: "goal",
          title: "Goal",
          type: "number",
        }),
        defineField({
          name: "current_amount_text_template",
          title: "Current amount text template",
          type: "string",
          description:
            "Template for the current amount text. Use {amount} to insert the current amount and {goal} to insert the goal amount.",
        }),
        defineField({
          name: "goal_amount_text_template",
          title: "Goal amount text template",
          type: "string",
          description: "Template for the goal amount text. Use {goal} to insert the goal amount.",
        }),
        defineField({
          name: "additional_external_contributions",
          title: "Additional external contributions",
          type: "number",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fundraiser_widget_configuration",
      title: "Fundraiser widget",
      type: "reference",
      to: [{ type: "fundraiserwidget" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "suggested_amounts",
      title: "Suggested donation amounts",
      type: "array",
      of: [{ type: "number" }],
      description:
        "Suggested donation amounts specific to this fundraiser. Leave empty to fall back to the widget configuration (for legacy fundraisers).",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || value.length === 0) {
            return true;
          }

          const hasInvalidValue = value.some((amount) => typeof amount !== "number" || amount <= 0);
          if (hasInvalidValue) {
            return "Suggested amounts must all be positive numbers";
          }

          return true;
        }),
    }),
    defineField({
      name: "gift_activity_config",
      title: "Gift activity",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Gift activity title",
          type: "string",
        }),
        defineField({
          name: "gift_amount_text_template",
          title: "Gift amount text template",
          type: "string",
        }),
        defineField({
          name: "show_more_text_template",
          title: "Show more text template",
          type: "string",
          description:
            "Template for the show more text. Use {count} to insert the number of hidden gifts.",
        }),
        defineField({
          name: "no_donations_text",
          title: "No donations text",
          type: "string",
          description: "Text to show when there are no donations.",
        }),
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        { type: "paragraph" },
        { type: "normalimage" },
        { type: "accordion" },
        { type: "itncoverage" },
        { type: "fundraiserchart" },
        { type: "newslettersignup" },
        { type: "blocktables" },
      ],
      description:
        "Content left aligned under the title and image on desktop. Note that not all elements will play nicely with this layout.",
    }),
    defineField({
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    }),
    defineField({
      name: "fundraiser_database_id",
      title: "Fundraiser database ID",
      type: "number",
      components: {
        input: FundraiserInput,
      },
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: { title: string }, options: any) => doc.title,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "fundraiser_image",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        media: selection.media,
      };
    },
  },
});
