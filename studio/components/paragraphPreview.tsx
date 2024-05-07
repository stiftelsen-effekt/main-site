import React from "react";
import { Stack, Text, Flex, Box } from "@sanity/ui";
import { Type } from "react-feather";
import { PreviewProps } from "sanity";

export const ParagraphPreview = (props: PreviewProps & { heading: string; subtitle: string }) => {
  const { heading, subtitle } = props;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Type size={24} />
      </Box>
      <Box marginLeft={3}>
        <Stack rows={1} space={3}>
          <Text>{heading}</Text>
          <Text size={1} muted textOverflow="ellipsis">
            {subtitle}
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
};
