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
      initialValue: 'support',
      validation: (Rule: any) => Rule.required()
    },
  ],
  preview: {
    select: {
      title: 'header.title'
    }
  }
} as const