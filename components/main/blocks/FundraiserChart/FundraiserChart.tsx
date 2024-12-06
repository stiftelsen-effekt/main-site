import React, { Suspense, useEffect, useRef, useState } from "react";
import { Fundraiserchart } from "../../../../studio/sanity.types";
import { DateTime } from "luxon";
import { FundraiserChartSkeleton } from "./ChartSkeleton";
import styles from "./FundraiserChart.module.scss";
import dynamic from "next/dynamic";
import { useRemSize } from "../../../../hooks/useRemSize";

const FundraiserChartElement = dynamic(
  () => import("./Chart").then((mod) => mod.FundraiserChartElement),
  {
    ssr: false,
  },
);

export const FundraiserChart: React.FC<Fundraiserchart> = (props) => {
  const [sums, setSums] = useState<null | { fundraiserId: number; sum: number }[]>(null);
  const [lastUpdated, setLastUpdated] = useState<DateTime | null>(null);
  const [fundraisersMap, setFundraisersMap] = useState<
    Map<number, { name: string; page_slug: string }>
  >(new Map());
  const graphWrapperRef = useRef<HTMLDivElement | null>(null);
  const remSize = useRemSize();
  const [graphHeight, setGraphHeight] = useState((props.fundraisers?.length || 0) * remSize * 8);

  useEffect(() => {
    // Update height whenever rem size or fundraisers change
    setGraphHeight((props.fundraisers?.length || 0) * remSize * 8);
  }, [props.fundraisers?.length, remSize]); // Add getRemInPixels if it's memoized/stable

  useEffect(() => {
    if (props.fundraisers) {
      const map = new Map<number, { name: string; page_slug: string }>();
      for (const f of props.fundraisers) {
        if (f.fundraiser_id && f.name && (f as any).page_slug)
          map.set(f.fundraiser_id, { name: f.name, page_slug: (f as any).page_slug });
      }
      setFundraisersMap(map);
    }
  }, [props.fundraisers]);

  useEffect(() => {
    const fetchSums = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EFFEKT_API}/fundraisers/donationsums?ids=${props.fundraisers
          ?.map((f) => f.fundraiser_id)
          .join(",")}`,
      );
      const data = await response.json();
      setSums(
        data.content.map((d: any) => ({
          fundraiserId: parseInt(d.fundraiserId),
          sum: parseFloat(d.sum),
        })),
      );
      const now = DateTime.now();
      const nowSkewed = now.set({
        minute: now.minute >= 30 ? 30 : 0,
        second: 0,
        millisecond: 0,
      });
      setLastUpdated(nowSkewed);
    };
    fetchSums();
  }, []);

  let graph = <FundraiserChartSkeleton numberOfFundraisers={props.fundraisers?.length || 0} />;
  if (sums !== null && fundraisersMap)
    graph = (
      <Suspense
        fallback={<FundraiserChartSkeleton numberOfFundraisers={props.fundraisers?.length || 0} />}
      >
        <FundraiserChartElement
          sums={sums}
          fundraisers={fundraisersMap}
          wrapperRef={graphWrapperRef}
        />
      </Suspense>
    );

  return (
    <div className={styles.wrapper}>
      <div ref={graphWrapperRef} className={styles.graphWrapper} style={{ height: graphHeight }}>
        {graph}
      </div>
      <div className={styles.caption}>
        {props.caption_template?.replaceAll(
          "{lastUpdated}",
          lastUpdated ? lastUpdated.toFormat("HH:mm") : "",
        )}
      </div>
    </div>
  );
};
