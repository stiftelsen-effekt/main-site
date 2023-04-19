import { Box, Flex, Grid, Stack, Text } from "@sanity/ui";
import React from "react";
import { List } from "react-feather";

export const OrganizationsListPreview = React.forwardRef((props, ref) => {
  if (!props.value) {
    return (
      <Text muted size={1}>
        No organizations
      </Text>
    );
  }

  const organizations = props.value.organizations;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <List size={24} />
      </Box>
      <Grid columns={organizations.length} gap={3} marginLeft={3}>
        {organizations.map((organization) => (
          <Stack rows={2} space={2}>
            <Text textOverflow={"ellipsis"} size={1}>
              {organization.name || "-"}
            </Text>
            <Text textOverflow={"ellipsis"} size={1} muted>
              {organization.oneliner || "-"}
            </Text>
          </Stack>
        ))}
      </Grid>
    </Flex>
  );
});
