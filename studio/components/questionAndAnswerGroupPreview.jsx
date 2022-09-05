import React from 'react'
import { Text, Grid, Flex, Stack } from '@sanity/ui'
// These are react components

export const QuestionAndAnswerGroupPreview = React.forwardRef((props, ref) => {
  const title = props.value.title
  const answers = props.value.answers

  if (!props.value.answers) {
    return <Stack rows={1} space={4}>
        <Flex direction="row">
          <Text>{title || '-'}</Text>
      </Flex>
    </Stack>
  }

  return <Stack rows={answers.length + 1} space={4}>
      <Flex direction="row">
        <Text>{title || '-'}</Text>
      </Flex>
      {answers.map(answer => <Stack rows={2} space={2}>
        <Text size={1} textOverflow={"ellipsis"}>{answer.question || '-'}</Text>
        <Text size={1} muted textOverflow={"ellipsis"}>{answer.answer}</Text>
      </Stack>)}
  </Stack>
})