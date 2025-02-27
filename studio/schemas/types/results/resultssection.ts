import { FileText } from "react-feather";
import { ContentSectionPreview } from "../../../components/contentSectionPreview";

export default {
  name: "resultssection",
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
        { type: "links" },
        { type: "normalimage" },
        { type: "fullimage" },
        { type: "resultsheadline" },
        { type: "cumulativedonationsgraph" },
        { type: "resultsoutput" },
        { type: "referralgraph" },
        { type: "giveblock" },
        { type: "reference", to: [{ type: "contactinfo" }] },
      ],
      options: {
        modal: "fullscreen",
      },
    },
    {
      name: "hidden",
      type: "boolean",
      title: "Hidden",
      description: "Hide this section from the website",
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "heading",
      inverted: "inverted",
      nodivider: "nodivider",
      blocks: "blocks",
      hidden: "hidden",
    },
  },
  components: {
    preview: ContentSectionPreview,
  },
} as const;
