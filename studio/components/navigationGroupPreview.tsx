import React, { useCallback, useEffect, useState } from "react";
import { PreviewProps } from "sanity";
import { Card, Flex, Stack, Text } from "@sanity/ui";
import { Clock, Eye, List } from "react-feather";
import { fetchPageViews } from "./pageviews";

export const NavigationGroupPreview = (
  props: PreviewProps & {
    title: string;
    item1slug: string;
    item2slug: string;
    item3slug: string;
    item4slug: string;
    item5slug: string;
    item6slug: string;
    item7slug: string;
    item8slug: string;
    item9slug: string;
  },
) => {
  const {
    title,
    item1slug,
    item2slug,
    item3slug,
    item4slug,
    item5slug,
    item6slug,
    item7slug,
    item8slug,
    item9slug,
  } = props;

  const slugs = [
    item1slug,
    item2slug,
    item3slug,
    item4slug,
    item5slug,
    item6slug,
    item7slug,
    item8slug,
    item9slug,
  ];

  const [loading, setLoading] = useState(true);
  const [pageViews, setPageViews] = useState<null | number>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPageViews = async () => {
      try {
        setLoading(true);
        const views = await fetchPageViews(slugs.filter(Boolean));
        if (isMounted) {
          setPageViews(views);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPageViews();

    return () => {
      isMounted = false;
    };
  }, [
    item1slug,
    item2slug,
    item3slug,
    item4slug,
    item5slug,
    item6slug,
    item7slug,
    item8slug,
    item9slug,
  ]);

  return (
    <Flex padding={2} align="center">
      <Flex align="center" flex={1} gap={2}>
        <Card border={true} style={{ width: 31, height: 31 }}>
          <Flex align="center" justify="center" flex={1} height={"fill"}>
            <List size={"1rem"} />
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
