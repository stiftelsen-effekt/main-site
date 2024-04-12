import { User } from "react-feather";

export default {
  name: "philantropicteaser",
  type: "document",
  title: "Philantropic teaser",
  icon: User,
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "description",
      type: "array",
      title: "Description",
      of: [{ type: "block" }],
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
    {
      name: "button",
      type: "object",
      title: "Button",
      fields: [
        {
          name: "text",
          type: "string",
          title: "Text",
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: "link",
          type: "navitem",
          title: "Link",
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: "people",
      type: "array",
      title: "People",
      of: [{ type: "reference", to: [{ type: "contributor" }] }],
    },
  ],
} as const;
