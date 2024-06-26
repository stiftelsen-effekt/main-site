import { Sunset } from "react-feather";
import { Pageheader } from "../../sanity.types";

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
      hidden: ({ parent }: { parent?: Pageheader }) =>
        parent ? parent.layout === "coverPhoto" : false,
    },
    {
      name: "inngress",
      title: "Inngress",
      type: "text",
      rows: 3,
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? parent.layout === "coverPhoto" : false,
    },
    {
      name: "coverPhoto",
      title: "Cover photo",
      type: "image",
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? parent.layout !== "coverPhoto" : true,
    },
    {
      name: "cta_label",
      title: "CTA label",
      type: "string",
      group: "content",
    },
    /** In future we might want to add link and navitem to CTA */
    {
      name: "cta_type",
      title: "CTA type",
      type: "string",
      group: "content",
      options: {
        list: [{ title: "Open widget", value: "open_widget" }],
      },
    },
    {
      name: "layout",
      title: "Layout",
      type: "string",
      group: "content",
      options: {
        list: ["default", "centered", "hero", "coverPhoto"],
      },
      initialValue: "default",
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
    {
      name: "seoKeywords",
      title: "SEO keywords",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Comma separated",
    },
    { name: "seoImage", title: "SEO Image", type: "image", group: "seo" },
    { name: "cannonicalUrl", title: "Cannonical URL", type: "url", group: "seo" },
  ],
} as const;
