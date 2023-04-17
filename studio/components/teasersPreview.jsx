import React from "react";
import { Grid, Stack, Text, Flex, Box } from "@sanity/ui";
import { Layers, Image } from "react-feather";
// These are react components

export const TeasersPreview = React.forwardRef((props, ref) => {
  if (!props.value.teasers)
    return (
      <Text>
        <Layers size={24} />
      </Text>
    );

  const maxcharacters = 64;
  const nteasers = props.value.teasers.length;
  const subtitlelength = Math.round(maxcharacters / nteasers);
  const titlelength = Math.round(maxcharacters / nteasers - 2);

  return (
    <Flex direction={"row"} align={"center"}>
      <Grid columns={props.value.teasers.length}>
        {props.value.teasers.map((p) => (
          <>
            <Box style={{ flexShrink: 0 }} marginBottom={1}>
              <Image size={24} />
            </Box>
            <Stack rows={2} space={2} marginRight={2}>
              <Text size={1} style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                {p.title
                  ? p.title.length > titlelength
                    ? p.title.substr(0, titlelength - 2) + "..."
                    : p.title
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
          </>
        ))}
      </Grid>
    </Flex>
  );
});
