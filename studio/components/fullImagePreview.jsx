import React from 'react'
import { Text, Flex, Stack, Box } from '@sanity/ui'
import { Image } from 'react-feather'

export const FullImagePreview = React.forwardRef((props, ref) => {
    return <Flex direction={'row'} align={'center'}>
      <Box style={{ flexShrink: 0 }}>
        <Image size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"}>{props.value.alt || '-'}</Text>
      </Stack>
    </Flex>
  }
)