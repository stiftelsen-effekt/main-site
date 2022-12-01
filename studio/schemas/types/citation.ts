import { Bookmark } from "react-feather";
import { CitationRenderer } from "../../components/citationRenderer";

export default {
  name: 'citation',
  type: 'document',
  title: 'citation',
  icon: Bookmark,
  blockEditor: {
    render: CitationRenderer
  },
  fields: [
    {
      type: 'string',
      name: 'type',
      title: 'Type',
      // validation: Rule => Rule.required(),
      options: {
        list: [
          "book",
          "article",
          "website",
          "video",
          "podcast",
          "misc"
        ],
      },
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author',
      hidden: ({ parent }) => typeof parent.type === 'undefined',
    },
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      hidden: ({ parent }) => typeof parent.type === 'undefined',
    },
    {
      name: 'journal',
      type: 'string',
      title: 'Journal',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'article',
    },
    {
      name: 'year',
      type: 'string',
      title: 'Year',
      hidden: ({ parent }) => typeof parent.type === 'undefined'
    },
    {
      name: 'volume',
      type: 'string',
      title: 'Volume',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'article'
    },
    {
      name: 'number',
      type: 'string',
      title: 'Number',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'article'
    },
    {
      name: 'pages',
      type: 'string',
      title: 'Pages',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || (parent.type !== 'article' && parent.type !== 'book')
    },
    {
      name: 'publisher',
      type: 'string',
      title: 'Publisher',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'book'
    },
    {
      name: 'address',
      type: 'string',
      title: 'Address',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'book'
    },
    {
      name: 'accessed',
      type: 'datetime',
      title: 'Accessed',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type !== 'website'
    },
    {
      name: 'timestamp',
      type: 'string',
      title: 'Timestamp',
      description: 'Timestamp for the cited information e.g. 32:45',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || (parent.type !== 'video' && parent.type !== 'podcast')
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL',
      hidden: ({ parent }) => typeof parent.type === 'undefined' || parent.type === 'book'
    }
  ],
  options: {
    editModal: 'dialog',
    preview: {
      select: {
        title: 'title',
        author: 'author',
        year: 'year',
      },
      prepare(selection) {
        const {author, year, title} = selection
        return {
          title: `${author ?? '-'} (${year ?? '-'})`,
          subtitle: title
        }
      }
    }
  },
}