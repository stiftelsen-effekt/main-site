import { TrendingUp } from "react-feather";

export default {
  name: "resultsteaser",
  type: "object",
  icon: TrendingUp,
  title: "Results teaser",
  preview: {
    select: {
      title: "title",
      subtitle: "paragraph",
    },
  },
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
  ],
} as const;
