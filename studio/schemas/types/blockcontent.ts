import { Bookmark, Divide, ExternalLink, Link } from "react-feather";
import { CitationRenderer } from "../../components/citationRenderer";

export const blocktype = {
  type: "block",
  marks: {
    annotations: [
      {
        name: "citation",
        type: "object",
        icon: Bookmark,
        fields: [
          {
            type: "array",
            name: "citations",
            title: "Citations",
            of: [
              {
                type: "reference",
                to: [{ type: "citation" }],
              },
            ],
          },
        ],
        blockEditor: {
          render: CitationRenderer,
        },
      },
      {
        name: "link",
        type: "link",
        icon: ExternalLink,
        title: "Link",
      },
      {
        name: "navitem",
        type: "navitem",
        icon: Link,
        title: "Navigation item",
      },
    ],
  },
} as const;
