import React, { useEffect } from "react";
import { Text, Grid, Flex, Stack } from "@sanity/ui";
import { PreviewProps, useFormValue } from "sanity";
import { Questionandanswergroup } from "../sanity.types";
// These are react components

export const QuestionAndAnswerGroupPreview = (props: PreviewProps & Questionandanswergroup) => {
  const { title, answers } = props;

  if (!answers || answers.length === 0) {
    return (
      <Stack rows={1} space={4}>
        <Flex direction="row">
          <Text>{title || "-"}</Text>
        </Flex>
      </Stack>
    );
  }

  // Pick the first three answers
  const firstThreeAnswers = answers.slice(0, 3);

  if (answers.length > 3) {
    firstThreeAnswers.pop();
  }

  return (
    <Stack rows={firstThreeAnswers.length + 1} space={4} padding={2}>
      <Flex direction="row">
        <Text weight={"semibold"}>{title || "-"}</Text>
      </Flex>
      {firstThreeAnswers.map((answer) => (
        <Stack rows={2} space={2} key={answer._key}>
          <Text size={1} textOverflow={"ellipsis"}>
            {answer.question || "-"}
          </Text>
          <Text size={1} muted textOverflow={"ellipsis"}>
            {answer.answer}
          </Text>
        </Stack>
      ))}
      {answers.length > 3 && (
        <Flex direction="row">
          <Text size={1} muted>
            +{answers.length - 3} more
          </Text>
        </Flex>
      )}
    </Stack>
  );
};
