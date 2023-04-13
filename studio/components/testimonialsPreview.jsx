import React from "react";
import { Text, Flex, Grid, Box, Stack } from "@sanity/ui";
import { MessageCircle } from "react-feather";

export const TestimonialsPreview = React.forwardRef((props, ref) => {
  if (!props.value) {
    return (
      <Text muted size={1}>
        No testimonials
      </Text>
    );
  }

  const testimonials = props.value.testimonials;

  return (
    <Flex direction={"row"} align={"center"}>
      <Box style={{ flexShrink: 0 }}>
        <MessageCircle size={24} />
      </Box>
      <Grid columns={testimonials.length} gap={3} marginLeft={3}>
        {testimonials.map((testimonial) => (
          <Stack rows={2} space={2}>
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
  );
});
