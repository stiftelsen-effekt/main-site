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