import React from 'react'
import { Stack, Text, Flex } from '@sanity/ui'
import { Type } from 'react-feather'
// These are react components

export const ParagraphPreview = React.forwardRef((props, ref) => {
    const heading = props.value.title
    const subtitle = props.value.subtitle

    return <Flex direction={'row'} align={'center'}>
        <Type size={24} />
        <Stack rows={1} space={3} marginLeft={3}>
          <Text>{heading}</Text>
          <Text size={1} muted textOverflow='ellipsis'>{subtitle}</Text>
        </Stack>
    </Flex>
  }
)