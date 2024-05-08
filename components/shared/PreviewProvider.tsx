import { LiveQueryProvider } from "next-sanity/preview";
import { useMemo } from "react";
import { getClient } from "../../lib/sanity.client";

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  console.log("PreviewProvider");
  const client = useMemo(() => getClient(token), [token]);
  return <LiveQueryProvider client={client}>{children}</LiveQueryProvider>;
}
