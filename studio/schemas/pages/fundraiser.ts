import { FundraiserInput } from "../../components/fundraiserInput";

export default {
  title: "Fundraiser",
  name: "fundraiser_page",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "header_image",
      title: "Header image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fundraiser_image",
      title: "Fundraiser image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fundraiser_organization",
      title: "Fundraiser organization",
      type: "reference",
      to: [{ type: "organization" }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fundraiser_organization_text_template",
      title: "Fundraiser organization text template",
      type: "string",
      description:
        "Template for the fundraiser organization text. Use {org} to insert the organization name.",
    },
    {
      name: "fundraiser_goal_config",
      title: "Fundraiser goal",
      type: "object",
      fields: [
        {
          name: "goal",
          title: "Goal",
          type: "number",
        },
        {
          name: "current_amount_text_template",
          title: "Current amount text template",
          type: "string",
          description:
            "Template for the current amount text. Use {amount} to insert the current amount and {goal} to insert the goal amount.",
        },
        {
          name: "goal_amount_text_template",
          title: "Goal amount text template",
          type: "string",
          description: "Template for the goal amount text. Use {goal} to insert the goal amount.",
        },
        {
          name: "additional_external_contributions",
          title: "Additional external contributions",
          type: "number",
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "fundraiser_widget_config",
      title: "Fundraiser widget",
      type: "object",
      fields: [
        {
          name: "suggested_amounts",
          title: "Suggested amounts",
          type: "array",
          of: [{ type: "number" }],
        },
      ],
    },
    {
      name: "gift_activity_config",
      title: "Gift activity",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Gift activity title",
          type: "string",
        },
        {
          name: "gift_amount_text_template",
          title: "Gift amount text template",
          type: "string",
        },
        {
          name: "show_more_text_template",
          title: "Show more text template",
          type: "string",
          description:
            "Template for the show more text. Use {count} to insert the number of hidden gifts.",
        },
        {
          name: "no_donations_text",
          title: "No donations text",
          type: "string",
          description: "Text to show when there are no donations.",
        },
      ],
    },
    {
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
    },
    {
      name: "content",
      title: "Sections",
      type: "array",
      of: [{ type: "contentsection" }],
    },
    {
      name: "fundraiser_database_id",
      title: "Fundraiser database ID",
      type: "number",
      components: {
        input: FundraiserInput,
      },
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: { title: string }, options: any) => doc.title,
      },
      validation: (Rule: any) => Rule.required(),
    },
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
} as const;
