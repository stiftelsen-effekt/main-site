import { Layers } from "react-feather";
import { TeasersPreview } from "../../components/teasersPreview";

export default {
  name: "teasers",
  type: "document",
  title: "Teasers",
  icon: Layers,
  fields: [
    {
      name: "teasers",
      type: "array",
      title: "Teasers",
      of: [{ type: "teasersitem" }],
    },
  ],

  preview: {
    select: {
      teasers: "teasers",
    },
    component: TeasersPreview,
  },
} as const;
