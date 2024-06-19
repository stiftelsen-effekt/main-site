import React from "react";
import { Text, Flex, Stack, Box } from "@sanity/ui";
import { Code } from "react-feather";
import { PreviewProps } from "sanity";
import { Htmlembed } from "../sanity.types";

export const HTMLEmbedPreview = (props: PreviewProps & Htmlembed) => {
  const { htmlcode } = props;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Code size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"} size={1} style={{ fontFamily: "monospace" }}>
          {htmlcode || "-"}
        </Text>
      </Stack>
    </Flex>
  );
};
