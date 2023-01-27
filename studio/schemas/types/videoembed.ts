import { Video } from "react-feather";

export default {
  name: 'videoembed',
  type: 'object',
  title: 'Videoembed',
  icon: Video,
  fields: [
    {
      name: 'url',
      type: 'string',
      title: 'Youtube url'
    },
    {
      name: 'thumbnail', 
      type: 'image',
      title: 'Thumbnail',
    }
  ]
}