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
      name: "main_currency",
      title: "Main Currency",
      type: "string",
      options: {
        list: ["NOK", "SEK", "DKK", "EUR", "USD"],
      },
    },
    {
      name: "main_locale",
      title: "Main Locale",
      type: "string",
      validation: (Rule: any) => Rule.required(),
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Norwegian", value: "no" },
          { title: "Swedish", value: "se" },
          { title: "Estonian", value: "et" },
        ],
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
  ],
};
