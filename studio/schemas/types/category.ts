import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  type: "document",
  title: "Category",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      title: "Description",
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare(selection: any) {
      return {
        title: selection.title,
        subtitle: selection.description,
      };
    },
  },
});
