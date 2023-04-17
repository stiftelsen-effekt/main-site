import { ContactPreview } from "../../components/contactPreview";

export default {
  name: "contactinfo",
  type: "document",
  title: "Contact information",
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
    {
      name: "phone",
      type: "string",
      title: "Phone",
    },
    {
      name: "email",
      type: "string",
      title: "Email",
    },
  ],
  preview: {
    select: {
      phone: "phone",
      email: "email",
    },
    component: ContactPreview,
  },
};
