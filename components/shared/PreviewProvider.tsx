import { LiveQueryProvider } from "@sanity/preview-kit";
import { ComponentProps, useMemo } from "react";
import { getClient } from "../../lib/sanity.client";

// @sanity/preview-kit (latest 6.2.0) still depends on @sanity/client v7, so its
// `SanityClient` type is nominally different from the v8 client we create (the
// classes have private fields). It only uses the stable public client API
// (`config`, `withConfig`, `fetch`, `live.events`), which v8 keeps unchanged,
// so passing the v8 client is safe at runtime.
type PreviewKitClient = ComponentProps<typeof LiveQueryProvider>["client"];

export default function PreviewProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const client = useMemo(() => getClient(token) as unknown as PreviewKitClient, [token]);
  return (
    <LiveQueryProvider client={client} token={token}>
      {children}
    </LiveQueryProvider>
  );
}
