export default {
  title: 'Articles page', 
  name: 'articles',
  type: 'document',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
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
      validation: (Rule: any) => Rule.required()
    },
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}