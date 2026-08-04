import { defineType, defineField } from "sanity";

export default defineType({
  name: "button",
  type: "document",
  title: "Button",
  icon: Link,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description: "Not needed if link in text",
    }),
    defineField({
      name: "url",
      type: "string",
      title: "Url",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "url",
    },
  },
});
