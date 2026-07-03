import { useLiveMode } from "@sanity/react-loader";
import { useMemo } from "react";
import { getClient } from "../../lib/sanity.client";

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const client = useMemo(() => getClient(token), [token]);
  // Enable @sanity/react-loader live mode: useQuery hooks subscribe to live
  // updates from the stega-encoded preview client while the Presentation tool
  // is open. Outside of this provider, useQuery just returns its `initial` data.
  useLiveMode({ client });
  return <>{children}</>;
}
