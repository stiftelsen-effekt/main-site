import { defineType, defineField } from "sanity";

export default defineType({
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
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
    }),
    defineField({
      name: "accent_color",
      title: "Accent Color (hex)",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
    }),
    defineField({
      name: "logo",
      title: "Site Logo",
      type: "image",
    }),
    defineField({
      name: "main_navigation",
      title: "Main Navigation",
      description: "Select pages for the top menu",
      type: "array",
      of: [{ type: "navitem" }, { type: "navgroup" }],
    }),
    defineField({
      name: "general_banner",
      title: "General Banner",
      type: "reference",
      to: [{ type: "generalbanner" }],
    }),
    defineField({
      name: "fundraiser_page_slug",
      title: "Fundraiser page slug",
      type: "string",
    }),
    defineField({
      name: "donate_label",
      title: "Donate label",
      type: "string",
      description: "Label for donate button in main menu",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donate_label_short",
      title: "Donate label (Short)",
      type: "string",
      description: "Label for the floating donate button",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "donate_label_title",
      title: "Donate label title",
      type: "string",
      description: "Alt text for the donate button",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "contact",
      title: "Contact info",
      type: "reference",
      to: [{ type: "contactinfo" }],
      options: {
        disableNew: true,
      },
    }),
    defineField({
      name: "main_currency",
      title: "Main Currency",
      type: "string",
      options: {
        list: ["NOK", "SEK", "DKK", "EUR", "USD"],
      },
    }),
    defineField({
      name: "main_locale",
      title: "Main Locale",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Norwegian", value: "no" },
          { title: "Swedish", value: "sv" },
          { title: "Estonian", value: "et" },
          { title: "Danish", value: "dk" },
        ],
      },
    }),
    defineField({
      title: "Footer columns",
      name: "footer_columns",
      description: "Select links for the footer columns",
      type: "array",
      group: "footer",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              title: "Links",
              name: "links",
              type: "array",
              of: [{ type: "navitem" }, { type: "link" }],
            }),
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
            prepare: (props) => {
              const values = Object.values(props).filter((prop) => prop !== undefined);
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
    }),
    defineField({
      name: "footer_to_top_label",
      title: "Footer to top label",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footer_newsletter_heading",
      title: "Footer newsletter label",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footer_newsletter_form_url",
      title: "Footer newsletter form url",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footer_newsletter_send_label",
      title: "Footer newsletter send label",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "footer_email_label",
      title: "Footer newsletter email label",
      type: "string",
      group: "footer",
    }),
    defineField({
      name: "cookie_banner_configuration",
      title: "Cookie banner configuration",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
        }),
        defineField({
          name: "privacy_policy_link",
          title: "Privacy policy link",
          type: "navitem",
        }),
        defineField({
          name: "accept_button_text",
          title: "Accept button text",
          type: "string",
        }),
        defineField({
          name: "decline_button_text",
          title: "Decline button text",
          type: "string",
        }),
        defineField({
          name: "last_major_change",
          title: "Last major change",
          type: "date",
        }),
        defineField({
          name: "expired_template",
          title: "Expired template",
          type: "string",
          description:
            "Template to prepend to the description when the cookie banner is expired, using {date} as a placeholder for the date of the last major change",
        }),
      ],
    }),
    defineField({
      name: "not_found_title",
      title: "Not found title",
      type: "string",
    }),
    defineField({
      name: "profile_page_enabled",
      title: "Profile page enabled",
      type: "boolean",
      description:
        "Enable or disable the profile page and related navigation links. When disabled, users won't see profile page links in navigation.",
      initialValue: true,
    }),
  ],
});
