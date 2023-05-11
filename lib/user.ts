import { User } from "@auth0/auth0-react";

const authUserIdClaim = process.env.NEXT_PUBLIC_AUTH_USER_ID_CLAIM;

if (!authUserIdClaim) throw new Error("NEXT_PUBLIC_AUTH_USER_ID_CLAIM not set");

export const getUserId = (user: User) => {
  const val = user[authUserIdClaim];
  if (typeof val !== "number") throw new Error(`User claim ${authUserIdClaim} is not a number`);

  return val;
};
