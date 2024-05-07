import { Divide } from "react-feather";
import KatexInput from "../../components/katexInput";
import { KatexPreview } from "../../components/katexPreview";
import { TexIcon } from "../../components/texIcon";

export default {
  name: "latex",
  type: "object",
  icon: TexIcon,
  title: "Block",
  components: {
    input: KatexInput,
    preview: KatexPreview,
  },
  fields: [
    {
      name: "latex",
      type: "text",
      title: "Latex",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "renderedHtml",
      type: "text",
      title: "Rendered",
      readOnly: true,
    },
  ],
  preview: {
    select: {
      latex: "latex",
      renderedHtml: "renderedHtml",
    },
  },
} as const;
