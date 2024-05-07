import React from "react";
import { Grid, Stack, Text, Flex, Box } from "@sanity/ui";
import { Layers, Image } from "react-feather";
import { PreviewProps } from "sanity";
import { Teasers } from "../sanity.types";
// These are react components

export const TeasersPreview = (props: PreviewProps & { teasers: Teasers["teasers"] }) => {
  if (!props.teasers)
    return (
      <Text>
        <Layers size={24} />
      </Text>
    );

  return (
    <Flex direction={"row"} align={"center"}>
      <Grid rows={props.teasers.length} gap={3} flex={1}>
        {props.teasers.map((p, i) => (
          <Flex
            direction={"row"}
            justify={"space-between"}
            align={"center"}
            gap={1}
            flex={1}
            key={p._key}
          >
            <Box style={{ flexShrink: 0, order: i % 2 == 0 ? 0 : 1 }}>
              <Image size={32} />
            </Box>
            <Stack rows={2} space={2} marginRight={2}>
              <Text size={1}>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    overflowY: "visible",
                    display: "block",
                  }}
                >
                  {p.title ?? "-"}
                </span>
              </Text>
              <Text size={1} muted>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflowX: "hidden",
                    overflowY: "visible",
                    display: "block",
                  }}
                >
                  {p.paragraph ?? "-"}
                </span>
              </Text>
            </Stack>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};
