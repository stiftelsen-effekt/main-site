import React from "react";
import { Grid, Stack, Text, Flex, Box } from "@sanity/ui";
import { Columns as ColumnsIcon } from "react-feather";
import { PreviewProps } from "sanity";
import { Columns } from "../sanity.types";
// These are react components

export const ColumnsPreview = (props: PreviewProps & Columns) => {
  const { columns } = props;

  if (!columns)
    return (
      <Text>
        <ColumnsIcon size={24} />
      </Text>
    );

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <ColumnsIcon size={24} />
      </Box>
      <Grid columns={columns.length} marginLeft={3}>
        {columns.map((c) => (
          <Stack rows={2} space={2} marginRight={2} key={c._key}>
            <Text size={1} textOverflow={"ellipsis"}>
              {c.title || "-"}
            </Text>
            <Text size={1} muted textOverflow={"ellipsis"}>
              {c.paragraph || "-"}
            </Text>
          </Stack>
        ))}
      </Grid>
    </Flex>
  );
};
