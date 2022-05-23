export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Site Title',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Site Description',
      type: 'text',
    },
    {
      title: 'Main Navigation',
      name: 'mainNav',
      description: 'Select pages for the top menu',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'about_us' },
            { type: 'frontpage' },
            { type: 'organizations' },
            { type: 'profile' },
            { type: 'contributor'}
          ],
        },
      ],
    },
  ],
};
