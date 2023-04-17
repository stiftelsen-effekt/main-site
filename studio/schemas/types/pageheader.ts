import { Sunset } from "react-feather";

export default {
  name: "pageheader",
  type: "document",
  title: "Page header",
  icon: Sunset,
  groups: [
    {
      name: "content",
      title: "Content",
      default: true,
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
      group: "content",
    },
    {
      name: "inngress",
      title: "Inngress",
      type: "text",
      rows: 3,
      group: "content",
    },
    {
      name: "centered",
      title: "Centered",
      type: "boolean",
      group: "content",
    },
    {
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
      group: "content",
    },
    { name: "seoTitle", title: "SEO title", type: "string", group: "seo" },
    { name: "seoDescription", title: "SEO description", type: "text", rows: 3, group: "seo" },
    { name: "seoImage", title: "SEO Image", type: "image", group: "seo" },
    { name: "cannonicalUrl", title: "Cannonical URL", type: "url", group: "seo" },
  ],
};
