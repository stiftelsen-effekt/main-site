export default {
  name: 'organizations',
  type: 'document',
  title: 'Organizations page',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'organizations',
      title: 'Organizations',
      type: 'array',
      of: [{ type: 'reference', to: [{type: 'organization'}] }]
    },
    {
      title: 'Sitemap priority',
      name: 'sitemap_priority',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(1)
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: 'organizations',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
} as const