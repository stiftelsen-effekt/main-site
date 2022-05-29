import { HelpCircle } from "react-feather";

export default {
  name: 'support',
  type: 'document',
  title: 'Support page',
  fields: [
    {
      name: 'header',
      title: 'Header',
      type: 'pageheader'
    },
    {
      name: 'questionandanswergroups',
      title: 'Questions and answers',
      type: 'array',
      of: [{ type: 'questionandanswergroup' }]
    },
    {
      name: 'contact',
      title: 'Contact info',
      type: 'reference',
      to: [{ type: 'contactinfo' }],
      options: {
        disableNew: true
      }
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      readOnly: false,
      initialValue: 'support'
    },
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
}