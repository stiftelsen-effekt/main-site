import { Mail } from "react-feather";

export default {
  name: "newslettersignup",
  type: "object",
  title: "Newsletter signup",
  icon: Mail,
  fields: [
    {
      name: "header",
      type: "string",
      title: "Header",
    },
    {
      name: "formurl",
      type: "string",
      title: "Form url",
    },
    {
      name: "sendlabel",
      type: "string",
      title: "Button text",
    },
  ],
} as const;
