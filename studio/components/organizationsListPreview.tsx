import { Box, Flex, Grid, Stack, Text } from "@sanity/ui";
import React from "react";
import { List } from "react-feather";
import { PreviewProps } from "sanity";
import { Organization } from "../sanity.types";

/** Shape produced by the organizationslist schema's preview.prepare */
export type OrganizationsListPreviewItem = Partial<Pick<Organization, "_id" | "name" | "oneliner">>;

export const OrganizationsListPreview = (
  props: PreviewProps & { organizations?: OrganizationsListPreviewItem[] },
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
      <Grid gridTemplateColumns={organizations.length} gap={3} marginLeft={3}>
        {organizations.map((organization) => (
          <Stack gap={2} key={organization._id}>
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
