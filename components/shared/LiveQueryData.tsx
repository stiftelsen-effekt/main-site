import type { QueryParams } from "@sanity/client";
import { useLiveQuery } from "@sanity/preview-kit";

export type LiveQueryInput = {
  result: unknown;
  query: string;
  queryParams?: QueryParams;
};

/**
 * Keeps `data.result` up to date with Sanity while in draft mode, and renders
 * `children` with the latest data. Load it through `LiveQuery` instead.
 */
export default function LiveQueryData<T extends LiveQueryInput>({
  data,
  children,
}: {
  data: T;
  children: (data: T) => React.ReactNode;
}) {
  const [result] = useLiveQuery(data.result, data.query, data.queryParams);

  return children(result ? { ...data, result } : data);
}
