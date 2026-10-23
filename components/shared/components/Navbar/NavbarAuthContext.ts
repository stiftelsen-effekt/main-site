import { createContext } from "react";

export type NavbarAuth = {
  loggedIn: boolean;
  logout: () => void;
};

// Provided by the Min side layout, where Auth0 is mounted. Elsewhere the navbar is logged out,
// so ordinary content pages don't need to load Auth0.
export const NavbarAuthContext = createContext<NavbarAuth>({
  loggedIn: false,
  logout: () => {},
});
