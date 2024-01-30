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
      name: "accent_color",
      title: "Accent Color (hex)",
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
      name: "main_navigation",
      title: "Main Navigation",
      description: "Select pages for the top menu",
      type: "array",
      of: [{ type: "navitem" }, { type: "navgroup" }],
    },
    {
      name: "donate_label",
      title: "Donate label",
      type: "string",
      description: "Label for donate button in main menu",
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: "donate_label_short",
      title: "Donate label (Short)",
      type: "string",
      description: "Label for the floating donate button",
      validation: (Rule: any) => Rule.required(),
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
          { title: "Swedish", value: "sv" },
          { title: "Estonian", value: "et" },
        ],
      },
    },
    {
      title: "Footer columns",
      name: "footer_columns",
      description: "Select links for the footer columns",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            {
              title: "Links",
              name: "links",
              type: "array",
              of: [{ type: "navitem" }, { type: "link" }],
            },
          ],
          preview: {
            select: {
              link0: "links.0.title",
              link1: "links.1.title",
              link2: "links.2.title",
              link3: "links.3.title",
              link4: "links.4.title",
              link5: "links.5.title",
            },
            prepare: (props: any) => {
              const values = Object.values(props).filter((prop: any) => prop !== undefined);
              if (values.length === 0) {
                return {
                  title: "Empty column",
                };
              } else {
                const joined = values.join(", ");
                const title = joined.length > 60 ? joined.substring(0, 60) + "..." : joined;
                return {
                  title,
                };
              }
            },
          },
        },
      ],
    },
    {
      name: "footer_to_top_label",
      title: "Footer to top label",
      type: "string",
      group: "footer",
    },
    {
      name: "footer_newsletter_heading",
      title: "Footer newsletter label",
      type: "string",
      group: "footer",
    },
    {
      name: "footer_newsletter_form_url",
      title: "Footer newsletter form url",
      type: "string",
      group: "footer",
    },
    {
      name: "footer_newsletter_send_label",
      title: "Footer newsletter send label",
      type: "string",
      group: "footer",
    },
    {
      name: "cookie_banner_configuration",
      title: "Cookie banner configuration",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
        },
        {
          name: "description",
          title: "Description",
          type: "string",
        },
        {
          name: "accept_button_text",
          title: "Accept button text",
          type: "string",
        },
        {
          name: "decline_button_text",
          title: "Decline button text",
          type: "string",
        },
      ],
    },
  ],
};
