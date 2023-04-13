import React from "react";
import { Grid, Stack, Text, Flex, Box } from "@sanity/ui";
import { List } from "react-feather";
// These are react components

export const PointlistPreview = React.forwardRef((props, ref) => {
  if (!props.value.points)
    return (
      <Text>
        <List size={24} />
      </Text>
    );

  const maxcharacters = 64;
  const npoints = props.value.points.length;
  const subtitlelength = Math.round(maxcharacters / npoints);
  const titlelength = Math.round(maxcharacters / npoints - 2);

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <List size={24} />
      </Box>
      <Grid columns={props.value.points.length} marginLeft={3}>
        {props.value.points.map((p) => (
          <Stack rows={2} space={2} marginRight={2}>
            <Text size={1} style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {p.heading
                ? p.heading.length > titlelength
                  ? p.heading.substr(0, titlelength - 2) + "..."
                  : p.heading
                : "-"}
            </Text>
            <Text size={1} muted style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {p.paragraph
                ? p.paragraph.length > subtitlelength
                  ? p.paragraph.substr(0, subtitlelength - 2) + "..."
                  : p.paragraph
                : "-"}
            </Text>
          </Stack>
        ))}
      </Grid>
    </Flex>
  );
});
