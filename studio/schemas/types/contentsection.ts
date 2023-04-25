import { FileText } from "react-feather";
import { ContentSectionPreview } from "../../components/contentSectionPreview";

export default {
  name: "contentsection",
  type: "document",
  title: "Section",
  icon: FileText,
  fieldsets: [
    {
      name: "layout",
      title: "Layout",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    {
      name: "heading",
      type: "string",
      title: "Header",
      fieldset: "layout",
    },
    {
      name: "nodivider",
      type: "boolean",
      title: "No divider line",
      fieldset: "layout",
    },
    {
      name: "inverted",
      type: "boolean",
      title: "Inverted",
      fieldset: "layout",
    },
    {
      name: "padded",
      type: "boolean",
      title: "Left right padded",
      fieldset: "layout",
    },
    {
      name: "ypadded",
      type: "boolean",
      title: "Top bottom padded",
      initialValue: true,
      fieldset: "layout",
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
        { type: "wealthcalculatorteaser" },
        { type: "htmlembed" },
        { type: "teasers" },
        { type: "interventionwidget" },
        { type: "giveblock" },
        { type: "givewellstamp" },
        { type: "organizationslist" },
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
} as const;
