import { defineType, defineField } from "sanity";
import { DollarSign } from "react-feather";

export default defineType({
  name: "plausiblerevenuetracker",
  type: "document",
  icon: DollarSign,
  title: "Plausible Revenue Tracker",
  fields: [
    defineField({
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: [
          { title: "Donation", value: "donation" },
          { title: "Agreement", value: "agreement" },
        ],
      },
    }),
    defineField({
      name: "enabled",
      type: "boolean",
      title: "Enabled",
    }),
  ],
});
