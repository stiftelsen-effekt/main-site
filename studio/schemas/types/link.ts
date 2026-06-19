import { Link } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "link",
  type: "document",
  title: "Link",
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
    defineField({
      name: "newtab",
      type: "boolean",
      title: "Open in new tab",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "url",
    },
  },
});
