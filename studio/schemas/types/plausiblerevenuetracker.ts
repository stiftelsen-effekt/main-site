import { DollarSign } from "react-feather";

export default {
  name: "plausiblerevenuetracker",
  type: "document",
  icon: DollarSign,
  title: "Plausible Revenue Tracker",
  fields: [
    {
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: [
          { title: "Donation", value: "donation" },
          { title: "Agreement", value: "agreement" },
        ],
      },
    },
    {
      name: "enabled",
      type: "boolean",
      title: "Enabled",
    },
  ],
};
