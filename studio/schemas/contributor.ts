export default {
  name: 'contributor',
  type: 'document',
  title: 'Contributors',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name'
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