import React from "react";
import { Text, Grid, Flex } from "@sanity/ui";
import { Mail, Phone } from "react-feather";
import { PreviewProps } from "sanity";
import { Contactinfo } from "../sanity.types";

export const ContactPreview = (props: PreviewProps & Contactinfo) => {
  const { phone, email } = props;

  return (
    <Grid columns={2} rows={1} padding={1}>
      <Flex direction={"row"} align={"center"} padding={2} gap={2}>
        <Phone size={25} />
        <Text>{phone ? phone : "-"}</Text>
      </Flex>
      <Flex direction={"row"} align={"center"} padding={2} gap={2}>
        <Mail size={25} />
        <Text>{email ? email : "-"}</Text>
      </Flex>
    </Grid>
  );
};
