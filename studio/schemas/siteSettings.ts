import { pages } from "./schema";

export default {
  name: 'site_settings',
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
      name: 'logo',
      title: 'Site Logo',
      type: 'image',
    },
    {
      title: 'Main Navigation',
      name: 'main_navigation',
      description: 'Select pages for the top menu',
      type: 'array',
      of: [{ type: 'navitem' }, { type: 'navgroup' }],
    },
    {
      name: 'contact',
      title: 'Contact info',
      type: 'reference',
      to: [{ type: 'contactinfo' }],
      options: {
        disableNew: true
      }
    }
  ],
};
