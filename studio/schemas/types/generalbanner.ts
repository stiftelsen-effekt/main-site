import { MessageSquare } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "generalbanner",
  type: "document",
  title: "Site banner",
  icon: MessageSquare,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "link",
      type: "navitem",
      title: "Link",
    }),
  ],
});
