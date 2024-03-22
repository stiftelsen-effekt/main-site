import { Divide } from "react-feather";
import KatexInput from "../../components/katexInput";
import { KatexPreview } from "../../components/katexPreview";

export default {
  name: "latex",
  type: "object",
  icon: Divide,
  title: "Latex",
  inputComponent: KatexInput,
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
    component: KatexPreview,
  },
} as const;
