import { Bookmark, ExternalLink, Link, Link2 } from "react-feather";
import { CitationRenderer } from "../../components/citationRenderer";

export const blocktype = {
  type: 'block',
  marks: {
    annotations: [
      {
        name: 'citation',
        type: 'object',
        icon: Bookmark,
        fields: [
          {
            type: 'reference',
            name: 'citation',
            title: 'Citation',
            to: [
              { type: 'citation' }
            ],
            
          }
        ],
        blockEditor: {
          render: CitationRenderer
        },
      },
      {
        name: 'link',
        type: 'link',
        icon: ExternalLink,
        title: 'Link',
      },
      {
        name: 'navitem',
        type: 'navitem',
        icon: Link,
        title: 'Navigation item',
      }
    ]
  }
}