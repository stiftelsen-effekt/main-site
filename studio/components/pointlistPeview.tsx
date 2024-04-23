import React from "react";
import { Grid, Stack, Text, Flex, Box, Card } from "@sanity/ui";
import { List } from "react-feather";
import { PreviewProps } from "sanity";
import { Pointlist } from "../sanity.types";
// These are react components

export const PointlistPreview = (props: PreviewProps & { points: Pointlist["points"] }) => {
  if (!props.points)
    return (
      <Text>
        <List size={24} />
      </Text>
    );

  const maxpoints = 5;
  const maxcharacters = 50;
  const npoints = Math.min(props.points.length, maxpoints);
  const overflowing = props.points.length - npoints;
  const subtitlelength = Math.round(maxcharacters / npoints);
  const titlelength = Math.round(maxcharacters / npoints - 2);

  return (
    <Flex direction={"row"} align={"center"}>
      <Box
        style={{
          flexShrink: 0,
          outlineWidth: 1,
          width: "2.0625rem",
          height: "2.0625rem",
          minWidth: "2.0625rem",
          borderRadius: "0.0625rem",
          boxSizing: "border-box",
          boxShadow: "inset 0 0 0 1px var(--card-fg-color)",
          opacity: 0.1,
        }}
        padding={1}
      >
        <List size={"1rem"} />
      </Box>
      <Grid columns={npoints + (overflowing > 0 ? 1 : 0)} marginLeft={3}>
        {props.points.slice(0, npoints).map((p) => (
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
        {overflowing > 0 && (
          <Card radius={5} padding={2} tone="primary" marginLeft={2}>
            <Text size={1} align={"center"} muted>{`+${overflowing}`}</Text>
          </Card>
        )}
      </Grid>
    </Flex>
  );
};
