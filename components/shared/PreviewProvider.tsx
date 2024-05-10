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
  const actualToken =
    "skTryNTwY4oa7eetqGATCQU1qapuZFuHOtc7Lw0iLMq9woJsSuO8pYMnVjSgodkuZAzduzmsyfzw9hSrZXk39YPqevxpcDIHy6WMVg0qPL7XBo9fFOH1PeSuEzhkXy4xDMih0pzTeK2NJI12MQEDcsuPDTZfFX5AN06m35rcG8TAa9kWaYxi";
  const client = useMemo(() => getClient(actualToken), [actualToken]);
  return (
    <LiveQueryProvider client={client} token={actualToken}>
      {children}
    </LiveQueryProvider>
  );
}
