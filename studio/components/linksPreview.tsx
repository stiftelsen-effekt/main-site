import React from "react";
import { Stack, Text, Flex, Card } from "@sanity/ui";
import { Box, Link as LinkIcon } from "react-feather";
import { PreviewProps } from "sanity";
import { Link, Links, Navitem } from "../sanity.types";
// These are react components

export const LinksPreview = (
  props: PreviewProps & Omit<Links, "links"> & { links: ((Link | Navitem) & { _key: string })[] },
) => {
  const { links } = props;

  if (!links)
    return (
      <Flex padding={2} align="center">
        <Flex align="center" flex={1} gap={2}>
          <Card border={true} style={{ width: 31, height: 31, flexShrink: 0 }}>
            <Flex align="center" justify="center" flex={1} height={"fill"} width={"fill"}>
              <LinkIcon size={"1rem"} />
            </Flex>
          </Card>
        </Flex>
      </Flex>
    );

  return (
    <Flex padding={2} align="center">
      <Flex align="center" flex={1} gap={2}>
        <Card border={true} style={{ width: 31, height: 31, flexShrink: 0 }}>
          <Flex align="center" justify="center" flex={1} height={"fill"} width={"fill"}>
            <LinkIcon size={"1rem"} />
          </Flex>
        </Card>
        <Stack rows={links.length} space={3}>
          {links.map((l) => (
            <Text size={1} key={l._key}>
              <div
                style={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  lineHeight: "1rem",
                }}
              >
                {l.title ? l.title + " →" : "-"}
              </div>
            </Text>
          ))}
        </Stack>
      </Flex>
    </Flex>
  );
};
