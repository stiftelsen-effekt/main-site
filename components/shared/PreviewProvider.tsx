import { useMemo } from "react";
import { getClient } from "../../lib/sanity.client";
import LiveQueryProvider from "@sanity/preview-kit";

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const client = useMemo(() => getClient(token), [token]);
  return (
    <LiveQueryProvider client={client} token={token}>
      {children}
    </LiveQueryProvider>
  );
}
