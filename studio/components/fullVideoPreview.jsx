import React from 'react'
import { Text, Flex, Stack, Box } from '@sanity/ui'
import { Video } from 'react-feather'

export const FullVideoPreview = React.forwardRef((props, ref) => {
    return <Flex direction={'row'} align={'center'}>
      <Box style={{ flexShrink: 0 }}>
        <Video size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"}>{props.value.alt || '-'}</Text>
      </Stack>
    </Flex>
  }
)