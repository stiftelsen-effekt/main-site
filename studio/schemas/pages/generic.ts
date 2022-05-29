export default {
  title: 'Generic page', 
  name: 'generic_page',
  type: 'document',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: { header: { title: string } }, options: any) => doc.header.title,
      }
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}