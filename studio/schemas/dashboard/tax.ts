import { defineType, defineField } from "sanity";
import { isShallowSlug } from "../../validators/isShallowSlug";

export default defineType({
  title: "Tax",
  name: "tax",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        { type: "metareceipt" },
        { type: "abouttaxdeductions" },
        { type: "taxunits" },
        { type: "taxstatements" },
      ],
      // Don't allow more than one of each type
      validation: (Rule) =>
        Rule.custom((features: any) => {
          const types = features.map((feature: { _type: string }) => feature._type);
          const uniqueTypes = [...Array.from(new Set(types))];
          if (uniqueTypes.length !== types.length) {
            return "You currently have more than one instance of the same feature";
          }
          return true;
        }).warning(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      readOnly: false,
      initialValue: "profile",
      description: "Relative to dashboard",
      validation: (Rule) => Rule.required().custom(isShallowSlug),
    }),
  ],
});
