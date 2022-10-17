export default {
  name: 'vippsagreement',
  type: 'document',
  title: 'Vipps agreement splash page',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'content',
      title: 'Sections',
      type: 'array',
      of: [{type: 'contentsection'}]
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
      initialValue: 'vippsagreement',
      validation: (Rule: any) => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}