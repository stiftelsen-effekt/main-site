import { ContactPreview } from "../../components/contactPreview";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactinfo",
  type: "document",
  title: "Contact information",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      title: "Description",
    }),
    defineField({
      name: "phone",
      type: "string",
      title: "Phone",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
    }),
  ],
  preview: {
    select: {
      phone: "phone",
      email: "email",
    },
  },
  components: {
    preview: ContactPreview,
  },
});
