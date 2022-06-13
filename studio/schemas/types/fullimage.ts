import { Image } from "react-feather";

export default {
  name: 'fullimage',
  type: 'object',
  title: 'Full image',
  icon: Image,
  preview: {
    select: {
      media: 'image',
      title: 'alt'
    }
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text'
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image'
    }
  ]
}