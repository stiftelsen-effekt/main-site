export default {
  name: "donationwidgetblock",
  type: "document",
  title: "Donation widget block",
  fields: [
    {
      name: "title",
      type: "string",
      title: "Title",
    },
    {
      name: "description",
      type: "text",
      title: "Description",
    },
    {
      name: "donationwidget",
      type: "reference",
      title: "Donation widget configuration",
      to: [{ type: "donationwidget" }],
    },
  ],
};
