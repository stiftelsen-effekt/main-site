export default {
  name: 'organizations',
  type: 'document',
  title: 'Organizations page',
  fields: [
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}]
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: true,
      initialValue: '/organizations'
    }
  ] 
}