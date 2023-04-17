import React from "react";
import { Text, Grid, Flex } from "@sanity/ui";
import { Mail, Phone } from "react-feather";
// These are react components

export const ContactPreview = React.forwardRef((props, ref) => {
  const phone = props.value.phone;
  const email = props.value.email;

  return (
    <Grid columns={2} rows={1}>
      <Flex direction={"row"} align={"center"} padding={2} gap={2}>
        <Phone size={24} />
        <Text>{phone ? phone : "-"}</Text>
      </Flex>
      <Flex direction={"row"} align={"center"} padding={2} gap={2}>
        <Mail size={24} />
        <Text>{email ? email : "-"}</Text>
      </Flex>
    </Grid>
  );
});
