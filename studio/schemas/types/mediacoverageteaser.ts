import { Camera } from "react-feather";
import { defineType } from "sanity";

export default defineType({
  name: "mediacoverageteaser",
  title: "Media Coverage Teaser",
  type: "object",
  icon: Camera,
  fields: [
    {
      name: "coverage",
      title: "Coverage",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "publication_logo",
              title: "Publication Logo",
              type: "image",
            },
            {
              name: "links",
              title: "Links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "link",
                      title: "Link",
                      type: "url",
                      validation: (Rule) => Rule.uri({ allowRelative: true }),
                    },
                    {
                      name: "link_text",
                      title: "Link Text",
                      type: "string",
                      validation: (Rule) => Rule.required().min(1).max(100),
                    },
                  ],
                  preview: {
                    select: {
                      title: "link_text",
                      url: "link",
                    },
                    prepare(selection) {
                      const { title, url } = selection;
                      return {
                        title: title || "No link text provided",
                        subtitle: url ? new URL(url).hostname : "No URL provided",
                      };
                    },
                  },
                },
              ],
              validation: (Rule) => Rule.required().min(1).max(3),
            },
          ],
          preview: {
            select: {
              title: "links.0.link_text",
              media: "publication_logo",
            },
            prepare(selection) {
              const { title, media } = selection;
              return {
                title: title,
                media: media,
              };
            },
          },
        },
      ],
    },
    {
      name: "read_more_button",
      title: "Read More Button",
      type: "navitem",
    },
  ],
});
