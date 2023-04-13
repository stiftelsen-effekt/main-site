export default {
  title: 'Tax page', 
  name: 'tax',
  type: 'document',
  groups: [
    {
      title: 'Skattenheter tab',
      name: 'taxunits_tab',
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: 'Facebook tab',
      name: 'facebook_tab',
      options: {
        collapsible: true,
        collapsed: true
      }
    },
    {
      title: 'Om skattefradra tab',
      name: 'about_taxdeductions_tab',
      options: {
        collapsible: true,
        collapsed: true
      }
    }
  ],
  fields: [
    {
      name: 'facebook_description',
      title: 'Hvordan finne betalings-ID',
      type: 'array',
      group: 'facebook_tab',
      of: [{type: 'block'}]
    },
    {
      name: 'facebook_description_links',
      title: 'Hvordan finne betalings-ID lenker',
      type: 'links',
      group: 'facebook_tab',
    },
    {
      name: 'about_taxdeductions',
      title: 'Om skattefradrag',
      type: 'array',
      group: 'about_taxdeductions_tab',
      of: [{type: 'block'}]
    },
    {
      name: 'about_taxdeductions_links',
      title: 'Om skattefradrag lenker',
      type: 'links',
      group: 'about_taxdeductions_tab',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: 'about',
      validation: (Rule: any) => Rule.required()
    },
  ],
} as const