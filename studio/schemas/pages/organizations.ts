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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: 'organizations'
    }
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}