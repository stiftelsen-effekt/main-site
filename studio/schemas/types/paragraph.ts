import { Type } from "react-feather";

export default {
  title: 'Paragraph', 
  name: 'paragraph',
  type: 'object',
  icon: Type,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [{type: 'block'}]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'content.0.children.0.text'
    }
  }
}