import React from "react";
import { Grid, Stack, Text, Flex, Box, Card } from "@sanity/ui";
import { Layers, Image } from "react-feather";
import { PreviewProps } from "sanity";
import { Teasers, Teasersitem } from "../sanity.types";
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
      <Grid rows={props.teasers.length} gap={1} flex={1}>
        {props.teasers.map((p, i) => (
          <Flex padding={2} align="center">
            <Flex align="center" flex={1} gap={2}>
              {i % 2 === 0 ? Icon : null}
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
                    {p.paragraph ? getSubtitle(p) : "-"}
                  </span>
                </Text>
              </Stack>
              {i % 2 === 1 ? Icon : null}
            </Flex>
          </Flex>
        ))}
      </Grid>
    </Flex>
  );
};

const getSubtitle = (teaseritem: Teasersitem) => {
  if (Array.isArray(teaseritem.paragraph)) {
    // PortableText, string together the text
    const text = teaseritem.paragraph.reduce((acc, block) => {
      if (block._type === "block") {
        return acc + block.children.map((child) => child.text).join("");
      }
      return acc;
    }, "");
    return text;
  } else {
    // String, return as is
    return teaseritem.paragraph;
  }
};

const Icon = (
  <Card border={true} style={{ width: 31, height: 31, flexShrink: 0 }}>
    <Flex align="center" justify="center" flex={1} height={"fill"} width={"fill"}>
      <Image size={"1rem"} />
    </Flex>
  </Card>
);
