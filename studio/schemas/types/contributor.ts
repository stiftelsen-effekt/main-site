export default {
  name: "contributor",
  type: "document",
  title: "Contributors",
  fields: [
    {
      name: "image",
      type: "image",
      title: "Image",
    },
    {
      name: "name",
      type: "string",
      title: "Name",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "email",
      type: "string",
      title: "Email",
    },
    {
      name: "role",
      type: "reference",
      title: "Role",
      to: [{ type: "role" }],
    },
    {
      name: "subrole",
      type: "text",
      rows: 3,
      title: "Sub-role",
    },
    {
      name: "order",
      type: "number",
      title: "Order",
    },
    {
      name: "additional",
      type: "text",
      rows: 3,
      title: "Additional info",
    },
  ],
} as const;
