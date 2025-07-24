import { Mail } from "react-feather";
import { defineType } from "sanity";

export default defineType({
  name: "formsparkform",
  title: "Formspark Form",
  type: "object",
  icon: Mail,
  fields: [
    {
      name: "form_id",
      title: "Formspark Form ID",
      type: "string",
      description: "Your Formspark form ID (e.g., your-form-id)",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "form_name",
      title: "Form Name",
      type: "string",
      description: "Internal name for this form",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "submit_target",
      title: "Submit Target",
      type: "string",
      options: {
        list: [
          { title: "Same Page", value: "_self" },
          { title: "New Tab", value: "_blank" },
        ],
        layout: "radio",
      },
      initialValue: "_self",
    },
    {
      name: "submit_button_text",
      title: "Submit Button Text",
      type: "string",
      initialValue: "Submit",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "success_message",
      title: "Success Message",
      type: "string",
      description: "Message to show after successful submission (only for same page submissions)",
      initialValue: "Thank you for your submission!",
    },
    {
      name: "fields",
      title: "Form Fields",
      type: "array",
      of: [
        {
          type: "object",
          name: "formField",
          title: "Form Field",
          fields: [
            {
              name: "field_name",
              title: "Field Name",
              type: "string",
              description: "Name attribute for the input (no spaces)",
              validation: (Rule) =>
                Rule.required()
                  .regex(/^[a-zA-Z0-9_-]+$/, {
                    name: "alphanumeric",
                    invert: false,
                  })
                  .error("Field name must be alphanumeric with underscores or hyphens only"),
            },
            {
              name: "field_label",
              title: "Field Label",
              type: "string",
              description: "Label displayed to users",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "field_type",
              title: "Field Type",
              type: "string",
              options: {
                list: [
                  { title: "Text", value: "text" },
                  { title: "Email", value: "email" },
                  { title: "Number", value: "number" },
                  { title: "Phone", value: "tel" },
                  { title: "URL", value: "url" },
                  { title: "Date", value: "date" },
                  { title: "Time", value: "time" },
                  { title: "Textarea", value: "textarea" },
                  { title: "Select Dropdown", value: "select" },
                  { title: "Checkbox", value: "checkbox" },
                  { title: "Radio Button Group", value: "radio" },
                ],
              },
              validation: (Rule) => Rule.required(),
            },
            {
              name: "placeholder",
              title: "Placeholder Text",
              type: "string",
              hidden: ({ parent }) =>
                parent?.field_type === "checkbox" ||
                parent?.field_type === "radio" ||
                parent?.field_type === "select",
            },
            {
              name: "options",
              title: "Options",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "value",
                      title: "Value",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    },
                    {
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (Rule) => Rule.required(),
                    },
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "value",
                    },
                  },
                },
              ],
              hidden: ({ parent }) =>
                parent?.field_type !== "select" && parent?.field_type !== "radio",
              validation: (Rule) =>
                Rule.custom((options: any, context: any) => {
                  const parent = context.parent;
                  if (parent?.field_type === "select" || parent?.field_type === "radio") {
                    return options && options.length > 0 ? true : "Please add at least one option";
                  }
                  return true;
                }),
            },
            {
              name: "validation",
              title: "Validation Rules",
              type: "object",
              fields: [
                {
                  name: "required",
                  title: "Required Field",
                  type: "boolean",
                  initialValue: false,
                },
                {
                  name: "min_length",
                  title: "Minimum Length",
                  type: "number",
                  hidden: ({ parent, document }) => {
                    const fieldType = parent?.parent?.field_type;
                    return fieldType !== "text" && fieldType !== "textarea";
                  },
                },
                {
                  name: "max_length",
                  title: "Maximum Length",
                  type: "number",
                  hidden: ({ parent, document }) => {
                    const fieldType = parent?.parent?.field_type;
                    return fieldType !== "text" && fieldType !== "textarea";
                  },
                },
                {
                  name: "min_value",
                  title: "Minimum Value",
                  type: "number",
                  hidden: ({ parent, document }) => {
                    const fieldType = parent?.parent?.field_type;
                    return fieldType !== "number";
                  },
                },
                {
                  name: "max_value",
                  title: "Maximum Value",
                  type: "number",
                  hidden: ({ parent, document }) => {
                    const fieldType = parent?.parent?.field_type;
                    return fieldType !== "number";
                  },
                },
                {
                  name: "pattern",
                  title: "Pattern (Regex)",
                  type: "string",
                  description: "Regular expression pattern for validation",
                  hidden: ({ parent, document }) => {
                    const fieldType = parent?.parent?.field_type;
                    return (
                      fieldType === "checkbox" || fieldType === "radio" || fieldType === "select"
                    );
                  },
                },
                {
                  name: "pattern_message",
                  title: "Pattern Error Message",
                  type: "string",
                  description: "Custom error message when pattern validation fails",
                  hidden: ({ parent }) => !parent?.pattern,
                },
              ],
            },
            {
              name: "rows",
              title: "Number of Rows",
              type: "number",
              initialValue: 4,
              hidden: ({ parent }) => parent?.field_type !== "textarea",
            },
            {
              name: "autocomplete",
              title: "Autocomplete",
              type: "string",
              description: "HTML autocomplete attribute (e.g., 'name', 'email', 'tel')",
              options: {
                list: [
                  { title: "Off", value: "off" },
                  { title: "On", value: "on" },
                  { title: "Name", value: "name" },
                  { title: "Email", value: "email" },
                  { title: "Username", value: "username" },
                  { title: "Current Password", value: "current-password" },
                  { title: "New Password", value: "new-password" },
                  { title: "Tel", value: "tel" },
                  { title: "Street Address", value: "street-address" },
                  { title: "Postal Code", value: "postal-code" },
                  { title: "Country", value: "country" },
                ],
              },
            },
          ],
          preview: {
            select: {
              title: "field_label",
              subtitle: "field_name",
              type: "field_type",
              required: "validation.required",
            },
            prepare(selection) {
              const { title, subtitle, type, required } = selection;
              return {
                title: title || "Untitled Field",
                subtitle: `${subtitle || "no-name"} (${type})${required ? " *" : ""}`,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: "honeypot_field",
      title: "Enable Honeypot",
      type: "boolean",
      description: "Add an invisible field to catch spam bots",
      initialValue: true,
    },
    {
      name: "custom_css_class",
      title: "Custom CSS Class",
      type: "string",
      description: "Optional CSS class for styling the form",
    },
  ],
  preview: {
    select: {
      title: "form_name",
      subtitle: "form_id",
      fields: "fields",
    },
    prepare(selection) {
      const { title, subtitle, fields } = selection;
      const fieldCount = fields ? fields.length : 0;
      return {
        title: title || "Untitled Form",
        subtitle: `${subtitle || "No form ID"} • ${fieldCount} field${fieldCount !== 1 ? "s" : ""}`,
      };
    },
  },
});
