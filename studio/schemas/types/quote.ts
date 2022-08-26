import { Bookmark } from "react-feather";

export default {
  name: 'quote',
  type: 'object',
  title: 'Quote',
  icon: Bookmark,
  fields: [
    {
      name: 'quote',
      type: 'text',
      lines: 3,
      title: 'Quote',
    },
    {
      name: 'quotation_marks',
      type: 'boolean',
      title: 'Quotation marks'
    },
    {
      name: 'offset',
      type: 'string',
      title: 'Offset',
      options: {
        list: ["Left", "Right"]
      }
    }
  ],
  preview: {
    select: {
      title: 'quote'
    }
  }
}