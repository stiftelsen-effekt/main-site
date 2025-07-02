import { defineType, defineField } from "sanity";

export default defineType({
  name: "role",
  type: "document",
  title: "Roles",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "id",
      title: "Id",
      type: "string",
    }),
  ],
});
