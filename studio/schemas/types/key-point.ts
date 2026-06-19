import { Check } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "key_point",
  type: "object",
  title: "Key point",
  icon: Check,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
    }),
    defineField({
      name: "body",
      type: "string",
      title: "body",
    }),
  ],
});
