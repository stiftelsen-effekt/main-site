import React, { Fragment } from 'react'
import { Text, Stack, ThemeProvider, Card } from '@sanity/ui'
import Preview from 'part:@sanity/base/preview';
import schema from 'part:@sanity/base/schema';
import QueryContainer from 'part:@sanity/base/query-container';
import Spinner from 'part:@sanity/components/loading/spinner';
// These are react components

export const ContentSectionPreview = React.forwardRef((props, ref) => {
  const hasHeader = !props.value.nodivider || props.value.title

  const referencePreview = (id) => (
    <QueryContainer
      query="*[_id==$id]"
      params={{ id }}
    >
      {({ result, loading }) =>
        loading ? (
          <Spinner center message="Loading items…" />
        ) : (
          result && (
            <div>
              {result.documents.map(document => (
                <Fragment key={document._id}>
                  <Preview value={document} type={schema.get(document._type)} />
                </Fragment>
              ))}
            </div>
          )
        )
      }
    </QueryContainer>
  )

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
        {props.value.blocks ? props.value.blocks.map(b => b._type !== 'reference' ? <Preview value={b} type={schema.get(b._type)} /> : referencePreview(b._ref)) : null}
      </Stack>
    </Card>
  </ThemeProvider>  
})