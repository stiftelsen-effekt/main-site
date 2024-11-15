import React, { useEffect, useState } from "react";
import { PreviewProps } from "sanity";
import { Navitem } from "../sanity.types";
import { Card, Flex, Stack, Text } from "@sanity/ui";
import { Clock, Link, Eye } from "react-feather";
import { fetchPageViews } from "./pageviews";

export const NavigationItemPreview = (props: PreviewProps & { title: string; slug: string }) => {
  const { title, slug } = props;

  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState<null | number>(null);

  useEffect(() => {
    setLoading(true);
    fetchPageViews([slug])
      .then((views) => {
        setPageViews(views);
      })
      .catch(() => {
        setPageViews(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, setLoading]);

  return (
    <Flex padding={2} align="center">
      <Flex align="center" flex={1} gap={2}>
        <Card border={true} style={{ width: 31, height: 31 }}>
          <Flex align="center" justify="center" flex={1} height={"fill"}>
            <Link size={"1rem"} />
          </Flex>
        </Card>
        <Stack rows={2} space={2} marginRight={2}>
          <Text size={1} style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {title}
          </Text>
          <Text size={1} muted style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {loading ? (
              "Loading..."
            ) : (
              <>
                <Eye
                  size={13}
                  style={{
                    marginRight: "0.5em",
                    marginLeft: "0.175em",
                    verticalAlign: "middle",
                    paddingBottom: "2px",
                  }}
                />
                {pageViews || "-"}
                <Clock
                  size={13}
                  style={{
                    marginRight: "0.5em",
                    marginLeft: "0.5em",
                    verticalAlign: "middle",
                    paddingBottom: "2px",
                  }}
                />
                6mo
              </>
            )}
          </Text>
        </Stack>
      </Flex>
    </Flex>
  );
};
