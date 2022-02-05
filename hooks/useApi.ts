import { Auth0ContextInterface, GetTokenSilentlyOptions, useAuth0 } from "@auth0/auth0-react";
import { GetTokenSilentlyVerboseResponse } from "@auth0/auth0-spa-js";
import { useEffect } from "react";

/**
 * Imported from the auth0 type definitions
 * This may break when the library updates
 */

type getAccessTokenSilently = {
  (options: GetTokenSilentlyOptions & { detailedResponse: true }): Promise<
    GetTokenSilentlyVerboseResponse
  >;
  (options?: GetTokenSilentlyOptions): Promise<string>;
  (options: GetTokenSilentlyOptions): Promise<
    GetTokenSilentlyVerboseResponse | string
  >;
}

export const useApi = <T>(endpoint: string, scope: string, getToken: getAccessTokenSilently, cb: (res: T) => void) => useEffect(() => {
  (async () => {
    try {
      const token = await getToken({
        audience: 'https://data.gieffektivt.no',
        scope: scope,
      });
      const response = await fetch('http://localhost:5050' + endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      cb((await response.json()).content);
    } catch (e) {
      console.error(e);
    }
  })();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [getToken, scope, endpoint])