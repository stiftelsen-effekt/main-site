import { defineType, defineField } from "sanity";
import { Mail } from "react-feather";

export default defineType({
  name: "newslettersignup",
  type: "object",
  title: "Newsletter signup",
  icon: Mail,
  fields: [
    defineField({
      name: "header",
      type: "string",
      title: "Header",
    }),
    defineField({
      name: "formurl",
      type: "string",
      title: "Form url",
    }),
    defineField({
      name: "sendlabel",
      type: "string",
      title: "Button text",
    }),
  ],
});
