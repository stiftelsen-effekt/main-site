import React from "react";
import { Text, Flex, Stack, Box } from "@sanity/ui";
import { Video } from "react-feather";
import { PreviewProps } from "sanity";
import { Fullvideo } from "../sanity.types";

export const FullVideoPreview = (props: PreviewProps & Fullvideo) => {
  const { alt } = props;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Video size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"}>{alt || "-"}</Text>
      </Stack>
    </Flex>
  );
};
