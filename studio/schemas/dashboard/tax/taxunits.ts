import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../../validators/isShallowSlug";

export default defineType({
  title: "Tax units",
  name: "taxunits",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "taxunits",
      description: "Relative to tax page",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
    defineField({
      name: "tax_units_title",
      title: "Tax units title",
      type: "string",
    }),
    defineField({
      name: "create_tax_unit_button_label",
      title: "Create tax unit button label",
      type: "string",
    }),
    defineField({
      name: "empty_tax_units_description",
      title: "Empty tax units description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "empty_tax_units_link_label",
      title: "Empty tax units link label",
      type: "string",
    }),
    defineField({
      name: "number_of_donations_label",
      title: "Number of donations label",
      type: "string",
    }),
    defineField({
      name: "sum_donations_label",
      title: "Sum donations label",
      type: "string",
    }),
    defineField({
      name: "sum_tax_deductions_label",
      title: "Sum tax deductions label",
      type: "string",
    }),
    defineField({
      name: "sum_tax_benefit_label",
      title: "Sum tax benefit label",
      type: "string",
    }),
  ],
});
