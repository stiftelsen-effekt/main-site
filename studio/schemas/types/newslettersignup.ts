import { defineType, defineField } from "sanity";
import { Mail } from "react-feather";

export default defineType({
  name: "newslettersignup",
  type: "document",
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
    defineField({
      name: "emailLabel",
      type: "string",
      title: "Email input placeholder",
      initialValue: "E-POST",
    }),
  ],
});
