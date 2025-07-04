import { FileText } from "react-feather";
import { ContentSectionPreview } from "../../components/contentSectionPreview";
import { useMemo } from "react";
import { defineType, defineField } from "sanity";

export default defineType({
  name: "contentsection",
  type: "document",
  title: "Section",
  icon: FileText,
  fieldsets: [
    {
      name: "layout",
      title: "Layout",
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Header",
      fieldset: "layout",
    }),
    defineField({
      name: "nodivider",
      type: "boolean",
      title: "No divider line",
      fieldset: "layout",
    }),
    defineField({
      name: "inverted",
      type: "boolean",
      title: "Inverted",
      fieldset: "layout",
    }),
    defineField({
      name: "padded",
      type: "boolean",
      title: "Left right padded",
      fieldset: "layout",
    }),
    defineField({
      name: "ypadded",
      type: "boolean",
      title: "Top bottom padded",
      initialValue: true,
      fieldset: "layout",
    }),
    defineField({
      name: "blocks",
      type: "array",
      title: "Content",
      of: [
        { type: "paragraph" },
        { type: "accordion" },
        { type: "quote" },
        { type: "splitview" },
        { type: "splitviewhtml" },
        { type: "columns" },
        { type: "links" },
        { type: "introsection" },
        { type: "fullimage" },
        { type: "normalimage" },
        { type: "questionandanswergroup" },
        { type: "pointlist" },
        { type: "videoembed" },
        { type: "fullvideo" },
        { type: "testimonials" },
        { type: "blocktables" },
        { type: "reference", to: [{ type: "contactinfo" }] },
        { type: "newslettersignup" },
        { type: "wealthcalculator" },
        { type: "contributorlist" },
        { type: "inngress" },
        { type: "wealthcalculatorteaser" },
        { type: "philantropicteaser" },
        { type: "resultsteaser" },
        { type: "htmlembed" },
        { type: "teasers" },
        { type: "interventionwidget" },
        { type: "taxdeductionwidget" },
        { type: "giveblock" },
        { type: "givewellstamp" },
        { type: "organizationslist" },
        { type: "opendistributionbutton" },
        { type: "giftcardteaser" },
        { type: "teamintroduction" },
        { type: "discountratecomparison" },
        { type: "itncoverage" },
        { type: "fundraiserchart" },
        { type: "plausiblerevenuetracker" },
        { type: "donationwidgetblock" },
        { type: "dkmembershipwidget" },
        { type: "dkmembershipdisplay" },
        { type: "dkrenewpayment" },
        { type: "mediacoverageteaser" },
      ],
      options: {
        modal: { type: "dialog", width: "auto" },
      },
    }),
    defineField({
      name: "hidden",
      type: "boolean",
      title: "Hidden",
      description: "Hide this section from the website",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      _key: "_key",
      heading: "heading",
      inverted: "inverted",
      nodivider: "nodivider",
      blocks: "blocks",
      hidden: "hidden",
    },
  },
  components: {
    preview: ContentSectionPreview,
  },
});
