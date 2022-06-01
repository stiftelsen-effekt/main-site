import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import { GetTokenSilentlyVerboseResponse } from "@auth0/auth0-spa-js";
import { useEffect, useState } from "react";

/**
 * Imported from the auth0 type definitions
 * This may break when the library updates
 */

export type getAccessTokenSilently = {
  (
    options: GetTokenSilentlyOptions & { detailedResponse: true },
  ): Promise<GetTokenSilentlyVerboseResponse>;
  (options?: GetTokenSilentlyOptions): Promise<string>;
  (options: GetTokenSilentlyOptions): Promise<GetTokenSilentlyVerboseResponse | string>;
};

export interface apiResult<T> {
  loading: boolean;
  error: any | null;
  data: T | null;
}

export const useApi = <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  scope: string,
  getToken: getAccessTokenSilently,
  condition?: boolean,
): apiResult<T> => {
  const [result, setResult] = useState<apiResult<T>>({ loading: true, data: null, error: null });
  useEffect(() => {
    (async () => {
      if (condition || typeof condition === "undefined") {
        const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";
        try {
          const token = await getToken({
            audience: "https://data.gieffektivt.no",
            scope: scope,
          });
          const response = await fetch(api + endpoint, {
            method: method,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = (await response.json()).content;
          setResult({ loading: false, error: null, data: data });
        } catch (e) {
          setResult({ loading: false, error: e, data: null });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition]);
  return result;
};
