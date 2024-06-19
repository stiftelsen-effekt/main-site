import React from "react";
import { Grid, Stack, Text, Flex, Box, Card } from "@sanity/ui";
import { List } from "react-feather";
import { PreviewProps } from "sanity";
import { Pointlist } from "../sanity.types";
import { Media } from "sanity/src/core/components/previews/_common/Media";
// These are react components

export const PointlistPreview = (props: PreviewProps & { points: Pointlist["points"] }) => {
  if (!props.points)
    return (
      <Text>
        <List size={24} />
      </Text>
    );

  const maxpoints = 5;
  const maxcharacters = 60;
  const npoints = Math.min(props.points.length, maxpoints);
  const overflowing = props.points.length - npoints;
  const subtitlelength = Math.round(maxcharacters / npoints);
  const titlelength = Math.round(maxcharacters / npoints - 2);

  return (
    <Flex padding={2} align="center">
      <Flex align="center" flex={1} gap={2}>
        <Card border={true} style={{ width: 31, height: 31 }}>
          <Flex align="center" justify="center" flex={1} height={"fill"}>
            <List size={"1rem"} />
          </Flex>
        </Card>
        <Grid columns={npoints + (overflowing > 0 ? 1 : 0)}>
          {props.points.slice(0, npoints).map((p) => (
            <Stack rows={2} space={2} marginRight={2} key={p._key}>
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
    </Flex>
  );
};
