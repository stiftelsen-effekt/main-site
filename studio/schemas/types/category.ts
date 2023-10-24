export default {
  name: "category",
  type: "document",
  title: "Category",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "description",
      type: "text",
      rows: 2,
      title: "Description",
    },
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
};
