import { FileText } from "react-feather";
import { ContentSectionPreview } from "../../components/contentSectionPreview";

export default {
  name: "contentsection",
  type: "document",
  title: "Section",
  icon: FileText,
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Header",
    },
    {
      name: "nodivider",
      type: "boolean",
      title: "No divider line",
    },
    {
      name: "inverted",
      type: "boolean",
      title: "Inverted",
    },
    {
      name: "padded",
      type: "boolean",
      title: "Left right padded",
    },
    {
      name: "blocks",
      type: "array",
      title: "Content",
      of: [
        { type: "paragraph" },
        { type: "quote" },
        { type: "splitview" },
        { type: "columns" },
        { type: "links" },
        { type: "introsection" },
        { type: "fullimage" },
        { type: "normalimage" },
        { type: "questionandanswergroup" },
        { type: "pointlist" },
        { type: "videoembed" },
        { type: "fullvideo" },
        { type: "testimonials" },
        { type: "reference", to: [{ type: "contactinfo" }] },
        { type: "newslettersignup" },
        { type: "wealthcalculator" },
        { type: "htmlembed" },
      ],
      options: {
        editModal: "fullscreen",
      },
    },
  ],
  preview: {
    select: {
      title: "heading",
      inverted: "inverted",
      nodivider: "nodivider",
      blocks: "blocks",
    },
    component: ContentSectionPreview,
  },
};
