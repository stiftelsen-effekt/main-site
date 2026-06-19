import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../validators/isShallowSlug";

export default defineType({
  name: "dashboard",
  title: "Dashboard",
  type: "document",
  fields: [
    defineField({
      name: "main_navigation",
      title: "Menu",
      type: "array",
      of: [{ type: "navitem" }, { type: "navgroup" }],
    }),
    defineField({
      name: "dashboard_logo",
      title: "Dashboard logo",
      type: "image",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "dashboard_label",
      title: "Dashboard label",
      type: "string",
      description: "Label for dashboard link in main menu",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logout_label",
      title: "Logout label",
      type: "string",
      description: "Label for logging out in main menu",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "login_error_configuration",
      title: "Login error configuration",
      type: "object",
      description:
        "Configuration for login error messages, used for the email verification for example",
      fields: [
        defineField({
          name: "login_button_label",
          title: "Login button label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "login_abort_label",
          title: "Login abort label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "missing_name_modal_configuration",
      title: "Missing name modal configuration",
      type: "object",
      description:
        "Configuration for the modal that asks for a name when the user does not have one",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "confirm_label",
          title: "Confirm label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "cancel_label",
          title: "Cancel label",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "failure_message",
          title: "Failure message",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "success_message",
          title: "Success message",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "dashboard_slug",
      title: "Dashboard slug",
      type: "slug",
      initialValue: "my-pages",
      description:
        "Entry point for dashboard. Please note that this must be an allowed redirect URI in Auth0.",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
  preview: {
    select: {
      title: "dashboard_label",
    },
  },
});
