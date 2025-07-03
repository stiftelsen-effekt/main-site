import { defineType } from "sanity";

export default defineType({
  name: "colecomponent",
  type: "document",
  title: "Cole Component",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      description: "The title of the component.",
    },
    {
      name: "image",
      type: "image",
      title: "Image",
      description: "An image associated with the component.",
    },
  ],
});
