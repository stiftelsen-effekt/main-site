import React from "react";
import { Text, Grid, Flex } from "@sanity/ui";
// These are react components

export const SectionPreivew = React.forwardRef((props, ref) => {
  return (
    <Grid columns={2} rows={1}>
      <Flex direction={"row"} align={"center"} padding={2} gap={2}>
        <Text>{JSON.stringify(props)}</Text>
      </Flex>
    </Grid>
  );
});
