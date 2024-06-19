import { Box, Flex, Grid, Stack, Text } from "@sanity/ui";
import React from "react";
import { List } from "react-feather";
import { Organization, Organizationslist } from "../sanity.types";

export const OrganizationsListPreview = (
  props: Omit<Organizationslist, "organizations"> & { organizations: Organization[] },
) => {
  const { organizations } = props;

  if (!organizations || organizations.length === 0) {
    return (
      <Text muted size={1}>
        No organizations
      </Text>
    );
  }

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <List size={24} />
      </Box>
      <Grid columns={organizations.length} gap={3} marginLeft={3}>
        {organizations.map((organization) => (
          <Stack rows={2} space={2} key={organization._id}>
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
};
