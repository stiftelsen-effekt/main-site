import type { Auth0ContextInterface } from "@auth0/auth0-react";

/**
 * The `getAccessTokenSilently` function returned by `useAuth0()`.
 * Derived from the library so it stays in sync with @auth0/auth0-react.
 */
export type getAccessTokenSilently = Auth0ContextInterface["getAccessTokenSilently"];

/**
 * Thrown when Auth0 resolves `getAccessTokenSilently()` without a token.
 *
 * Since @auth0/auth0-spa-js 2.22 this happens when the session has passed its
 * `session_expiry` ceiling: the SDK clears the local session and returns
 * `undefined` instead of throwing. Auth0Provider then resets `user` /
 * `isAuthenticated`, so UserWrapper sends the user back to login; this error
 * just stops us from calling the API with `Bearer undefined` in the meantime.
 */
export class MissingAccessTokenError extends Error {
  constructor() {
    super("No access token available. The login session has probably expired.");
    this.name = "MissingAccessTokenError";
  }
}

/**
 * Gets an access token from Auth0, throwing if none is available.
 * Use this instead of calling `getAccessTokenSilently()` directly.
 */
export const getAccessToken = async (fetchToken: getAccessTokenSilently): Promise<string> => {
  const token = await fetchToken();
  if (!token) throw new MissingAccessTokenError();
  return token;
};

export interface apiResult<T> {
  loading: boolean;
  error: any | null;
  data: T | null;
}
