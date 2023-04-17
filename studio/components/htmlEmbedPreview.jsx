import React from "react";
import { Text, Flex, Stack, Box } from "@sanity/ui";
import { Code } from "react-feather";

export const HTMLEmbedPreview = React.forwardRef((props, ref) => {
  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Code size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"} size={1} style={{ fontFamily: "monospace" }}>
          {props.value.htmlcode || "-"}
        </Text>
      </Stack>
    </Flex>
  );
});
