import { defineType, defineField } from "sanity";
import { User } from "react-feather";

export default defineType({
  name: "philantropicteaser",
  type: "document",
  title: "Philantropic teaser",
  icon: User,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "array",
      title: "Description",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Links",
      of: [{ type: "link" }, { type: "navitem" }],
    }),
    defineField({
      name: "button",
      type: "object",
      title: "Button",
      fields: [
        defineField({
          name: "text",
          type: "string",
          title: "Text",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "link",
          type: "navitem",
          title: "Link",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "people",
      type: "array",
      title: "People",
      of: [{ type: "reference", to: [{ type: "contributor" }] }],
    }),
  ],
});
