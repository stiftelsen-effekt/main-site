export default {
  name: "site_settings",
  title: "Site Settings",
  type: "document",
  groups: [
    {
      name: "footer",
      title: "Footer",
    },
  ],
  fields: [
    {
      name: "title",
      title: "Site Title",
      type: "string",
    },
    {
      name: "description",
      title: "Site Description",
      type: "text",
    },
    {
      name: "logo",
      title: "Site Logo",
      type: "image",
    },
    {
      title: "Main Navigation",
      name: "main_navigation",
      description: "Select pages for the top menu",
      type: "array",
      of: [{ type: "navitem" }, { type: "navgroup" }],
    },
    {
      name: "contact",
      title: "Contact info",
      type: "reference",
      to: [{ type: "contactinfo" }],
      options: {
        disableNew: true,
      },
    },
    {
      title: "Footer column 1",
      name: "footer_column_1",
      description: "Select links for the first footer column",
      type: "array",
      group: "footer",
      of: [{ type: "navitem" }, { type: "link" }],
    },
    {
      title: "Footer column 2",
      name: "footer_column_2",
      description: "Select links for the second footer column",
      type: "array",
      group: "footer",
      of: [{ type: "navitem" }, { type: "link" }],
    },
    {
      title: "Footer column 3",
      name: "footer_column_3",
      description: "Select links for the third footer column",
      type: "array",
      group: "footer",
      of: [{ type: "navitem" }, { type: "link" }],
    },
    {
      type: "array",
      name: "payment_providers",
      title: "Payment providers",
      of: [
        {
          type: "reference",
          title: "Payment provider",
          to: [{ type: "vipps" }],
        },
      ],
    },
  ],
};
