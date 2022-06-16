import { Sunset } from "react-feather";

export default {
  name: 'pageheader',
  type: 'document',
  title: 'Page header',
  icon: Sunset,
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title'
    },
    {
      name: 'inngress',
      title: 'Inngress',
      type: 'text',
      rows: 3
    },
    {
      name: 'centered',
      title: 'Centered',
      type: 'boolean'
    },
    {
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [{ type: 'link' }]
    },
    {name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'},
    {name: 'seoKeywords', title: 'Keywords', type: 'tags', group: 'seo'},
    {name: 'seoSlug', title: 'Slug', type: 'slug', group: 'seo'},
    {name: 'seoImage', title: 'Image', type: 'image', group: 'seo'},
  ]
}