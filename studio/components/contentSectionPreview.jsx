import React from 'react'
import { Text, Stack, ThemeProvider, Card } from '@sanity/ui'
import { PointlistPreview } from './pointlistPeview'
import { Mail, Phone } from 'react-feather'
import { LinksPreview } from './linksPreview'
import { ParagraphPreview } from './paragraphPreview'
// These are react components

export const ContentSectionPreview = React.forwardRef((props, ref) => {
  const hasHeader = !props.value.nodivider || props.value.title

  function renderBlockPreview(b) {
    switch (b._type) {
      case 'pointlist':
        return <PointlistPreview value={{ points: b.points }}/>
      case 'paragraph':
        return <ParagraphPreview value={{ title: b.title, subtitle: b.content[0].children[0].text }} />
      case 'links':
        return <LinksPreview value={{ links: b.links }} />
      default:
        return <Text>{JSON.stringify(b)}</Text>
    }
  }

    return <ThemeProvider scheme={props.value.inverted ? 'dark' : 'light'}>
      <Card padding={2} radius={4}>
        <Stack space={4}>
          {hasHeader ?
            <Stack>
              {props.value.nodivider ? null : <hr width='100%' />}
              {props.value.title ? <Text size={1}>{props.value.title}</Text> : null}
            </Stack> : 
            null
          }
          {props.value.blocks.map(b => renderBlockPreview(b))}
        </Stack>
      </Card>
    </ThemeProvider>
  }
)