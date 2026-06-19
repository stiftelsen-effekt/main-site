import { Sunset } from "react-feather";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "articleheader",
  type: "document",
  title: "Article header",
  icon: Sunset,
  groups: [
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    defineField({
      name: "inngress",
      title: "Inngress",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "date",
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string", group: "seo" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({
      name: "seoKeywords",
      title: "SEO keywords",
      type: "text",
      rows: 3,
      group: "seo",
      description: "Comma separated",
    }),
    defineField({ name: "seoImage", title: "SEO Image", type: "image", group: "seo" }),
    defineField({ name: "cannonicalUrl", title: "Cannonical URL", type: "url", group: "seo" }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      group: "seo",
      description: "Prevent search engines from indexing this page and exclude it from the sitemap",
      initialValue: false,
    }),
  ],
});
