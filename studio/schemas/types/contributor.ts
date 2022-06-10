export default {
  name: 'contributor',
  type: 'document',
  title: 'Contributors',
  fields: [
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      validation: Rule => Rule.required()
    },
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: Rule => Rule.required()
    },
    {
      name: 'email',
      type: 'string',
      title: 'Email'
    },
    {
      name: 'role',
      type: 'reference',
      title: 'Role',
      to: [{ type: 'role' }]
    },
    {
      name: 'subrole',
      type: 'string',
      title: 'Sub-role'
    },
    {
      name: 'additional',
      type: 'string',
      title: 'Additional info'
    }
  ]
}