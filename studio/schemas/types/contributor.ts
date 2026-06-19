import { defineType, defineField } from "sanity";

export default defineType({
  name: "contributor",
  type: "document",
  title: "Contributors",
  fields: [
    defineField({
      name: "image",
      type: "image",
      title: "Image",
    }),
    defineField({
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "first_name",
      type: "string",
      title: "First Name",
      validation: (Rule) => Rule.required(),
      description: "Optional first, name, used for when only the first name is displayed.",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone",
    }),
    defineField({
      name: "role",
      type: "reference",
      title: "Role",
      to: [{ type: "role" }],
    }),
    defineField({
      name: "subrole",
      type: "text",
      rows: 3,
      title: "Sub-role",
    }),
    defineField({
      name: "order",
      type: "number",
      title: "Order",
    }),
    defineField({
      name: "additional",
      type: "text",
      rows: 3,
      title: "Additional info",
    }),
  ],
});
