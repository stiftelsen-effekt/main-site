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
