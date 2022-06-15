import React from 'react'
import { Stack, Text, Flex } from '@sanity/ui'
import { Link } from 'react-feather'
// These are react components

export const LinksPreview = React.forwardRef((props, ref) => {
    const links = props.value.links

    if (!links)
      return (<Flex direction={'row'} align={'center'}>
      <Link size={24} />
      </Flex>)

    return <Flex direction={'row'} align={'center'}>
        <Link size={24} />
        <Stack rows={links.length} space={3} marginLeft={3}>
          {links.map(l => <Text size={1} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{l.title ? l.title + ' →' : '-'}</Text>)}
        </Stack>
    </Flex>
  }
)