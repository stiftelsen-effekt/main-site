import { Gift } from "react-feather";

export default {
  name: "giftcardteaser",
  type: "document",
  title: "Gift card teaser",
  icon: Gift,
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
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      validation: (Rule: any) => Rule.required(),
    },
  ],
} as const;
