import { Bookmark, ExternalLink, Link } from "react-feather";
import { MathRenderer } from "../../components/mathRenderer";
import { TexIcon } from "../../components/texIcon";

export const blocktype = {
  type: "block",
  marks: {
    decorators: [
      { title: "Strong", value: "strong" },
      { title: "Emphasis", value: "em" },
      { title: "Code", value: "code" },
      { title: "Underline", value: "underline" },
      { title: "Strike", value: "strike-through" },
      { title: "Math", value: "math", component: MathRenderer, icon: TexIcon },
    ],
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
