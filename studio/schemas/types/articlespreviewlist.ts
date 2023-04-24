import { Grid } from "react-feather";

export default {
  name: "articlespreviewlist",
  type: "object",
  title: "Articles preview list",
  icon: Grid,
  fields: [
    // hidden field
    {
      name: "empty",
      type: "boolean",
      title: "Empty",
      hidden: true,
      initialValue: false,
    },
  ],
  preview: {
    prepare() {
      return {
        title: "All articles",
      };
    },
  },
} as const;
