export default {
  name: "donationstabledetailsconfiguration",
  description: "Configuration for the expanded view of the donations table",
  type: "object",
  fields: [
    {
      name: "status_estimate_header",
      title: "Status estimate header",
      type: "string",
    },
    {
      name: "date_and_amount",
      title: "Date and amount",
      type: "string",
      description: "Use {{date}}  {{amount}} kr",
    },
    {
      name: "status_estimate_explanation_title",
      title: "Status estimate explanation title",
      type: "string",
    },
    {
      name: "status_estimate_explanation_text",
      title: "Status estimate explanation text",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "expansionWindow",
      title: "Expansion Window",
      type: "object",
      fields: [
        {
          name: "mottatt_title",
          title: "Mottatt title",
          type: "string",
        },
        {
          name: "mottatt_undetitle",
          title: "Mottatt undertitle",
          type: "array",
          of: [{ type: "block" }],
        },
        {
          name: "overfort_title",
          title: "Overført title",
          type: "string",
        },
        {
          name: "overfort_undetitle",
          title: "Overført undertitle",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },

    {
      name: "impact_estimate_header",
      title: "Impact estimate header",
      type: "string",
    },
    {
      name: "impact_estimate_explanation_title",
      title: "Impact estimate explanation title",
      type: "string",
    },
    {
      name: "impact_estimate_explanation_text",
      title: "Impact estimate explanation text",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "impact_estimate_explanation_links",
      title: "Impact estimate explanation links",
      type: "array",
      of: [{ type: "link" }, { type: "navitem" }],
    },
    {
      name: "impact_items_configuration",
      title: "Impact items configuration",
      type: "object",
      fields: [
        {
          name: "smart_distribution_label",
          title: "Smart distribution label",
          type: "string",
        },
        {
          name: "operations_label",
          title: "Operations label",
          type: "string",
        },
        {
          name: "impact_item_configuration",
          title: "Impact item configuration",
          type: "object",
          fields: [
            {
              name: "output_subheading_format_string",
              title: "Output subheading format string",
              type: "string",
              description:
                "Use {{sum}} insert the donation sum to the organization, and {{org}} to insert the organization name",
            },
            {
              name: "missing_evaluation_header",
              title: "Missing evaluation header",
              type: "string",
            },
            {
              name: "missing_impact_evaluation_text",
              title: "Missing impact evaluation text",
              type: "array",
              of: [{ type: "block" }],
            },
            {
              name: "about_org_link_title_format_string",
              title: "About org link title format string",
              type: "string",
              description: "Use {{org}} to insert the organization name",
            },
            {
              name: "about_org_link_url_format_string",
              title: "About org link url format string",
              type: "string",
              description: "Use {{org}} to insert the organization name",
            },
          ],
        },
      ],
    },
  ],
  options: {
    collapsible: true,
    collapsed: true,
  },
};
