import React from "react";
import { Grid, Stack, Text, Flex, Box } from "@sanity/ui";
import { Columns } from "react-feather";
// These are react components

export const ColumnsPreview = React.forwardRef((props, ref) => {
  if (!props.value.columns)
    return (
      <Text>
        <Columns size={24} />
      </Text>
    );

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <Columns size={24} />
      </Box>
      <Grid columns={props.value.columns.length} marginLeft={3}>
        {props.value.columns.map((c) => (
          <Stack rows={2} space={2} marginRight={2}>
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
});
