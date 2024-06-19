import React from "react";
import { Text, Flex, Stack, Box } from "@sanity/ui";
import { Image } from "react-feather";
import { PreviewProps } from "sanity";
import { Fullimage } from "../sanity.types";

export const FullImagePreview = (props: PreviewProps & Fullimage) => {
  const { alt } = props;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Image size={24} />
      </Box>
      <Stack marginLeft={3}>
        <Text textOverflow={"ellipsis"}>{alt || "-"}</Text>
      </Stack>
    </Flex>
  );
};
