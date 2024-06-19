import React from "react";
import { Text, Flex, Grid, Box, Stack, Card } from "@sanity/ui";
import { MessageCircle } from "react-feather";
import { PreviewProps } from "sanity";
import { Testimonial, Testimonials } from "../sanity.types";

export const TestimonialsPreview = (
  props: PreviewProps & Omit<Testimonials, "testimonials"> & { testimonials: Testimonial[] },
) => {
  const { testimonials } = props;

  if (!testimonials) {
    return (
      <Text muted size={1}>
        No testimonials
      </Text>
    );
  }

  return (
    <Flex padding={2} align="center">
      <Flex align="center" flex={1} gap={2}>
        <Card border={true} style={{ width: 31, height: 31, flexShrink: 0 }}>
          <Flex align="center" justify="center" flex={1} height={"fill"} width={"fill"}>
            <MessageCircle size={"1rem"} />
          </Flex>
        </Card>
        <Grid columns={testimonials.length} gap={3}>
          {testimonials.map((testimonial, i) => (
            <Stack rows={2} space={2} key={i}>
              <Text textOverflow={"ellipsis"} size={1}>
                {testimonial.quotee || "-"}
              </Text>
              <Text textOverflow={"ellipsis"} size={1} muted>
                {testimonial.quote || "-"}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Flex>
    </Flex>
  );
};
