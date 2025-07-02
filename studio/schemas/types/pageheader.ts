import { defineType, defineField, Rule } from "sanity";
import { Sunset } from "react-feather";
import { Pageheader } from "../../sanity.types";

const noTitleTextLayouts = ["coverPhoto", "noheader"];

export default defineType({
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
    defineField({
      name: "title",
      type: "text",
      title: "Title",
      group: "content",
      rows: 1,
      hidden: ({ parent }: { parent?: Pageheader }) =>
        parent ? noTitleTextLayouts.indexOf(parent.layout) !== -1 : false,
    }),
    defineField({
      name: "inngress",
      title: "Inngress",
      type: "text",
      rows: 3,
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? noTitleTextLayouts.indexOf(parent.layout) !== -1 : false,
    }),
    defineField({
      name: "coverPhoto",
      title: "Cover photo",
      type: "image",
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? parent.layout !== "coverPhoto" : true,
    }),
    defineField({
      name: "cta_label",
      title: "CTA label",
      type: "string",
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? noTitleTextLayouts.indexOf(parent.layout) !== -1 : false,
    }),
    /** In future we might want to add link and navitem to CTA */
    defineField({
      name: "cta_type",
      title: "CTA type",
      type: "string",
      group: "content",
      options: {
        list: [{ title: "Open widget", value: "open_widget" }],
      },
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? noTitleTextLayouts.indexOf(parent.layout) !== -1 : false,
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      group: "content",
      options: {
        list: ["default", "centered", "hero", "coverPhoto", "noheader"],
      },
      initialValue: "default",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
      group: "content",
      hidden: ({ parent }: { parent: Pageheader }) =>
        parent ? noTitleTextLayouts.indexOf(parent.layout) !== -1 : false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      group: "seo",
      /* Validate give a warning if no title, as it defaults to the page title */
      validation: (rule) =>
        rule.custom((field: string | null, context) => {
          const parent = context.parent as Pageheader;
          if ((!parent.title || parent.title.length === 0) && (!field || field.length === 0)) {
            return "SEO title is required if the page header has no title";
          }
          return true;
        }),
    }),
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
  ],
});
