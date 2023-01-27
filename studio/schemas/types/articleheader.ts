import { Sunset } from "react-feather";

export default {
  name: 'articleheader',
  type: 'document',
  title: 'Article header',
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
      name: 'published',
      title: 'Published',
      type: 'date'
    },
    {name: 'seoTitle', title: 'SEO title', type: 'string', group: 'seo'},
    {name: 'seoDescription', title: 'SEO description', type: 'text', rows: 3, group: 'seo'},
    {name: 'seoImage', title: 'SEO Image', type: 'image', group: 'seo'},
    {name: 'cannonicalUrl', title: 'Cannonical URL', type: 'url', group: 'seo'}
  ]
}