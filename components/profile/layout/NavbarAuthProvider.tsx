import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavbarAuthContext } from "../../shared/components/Navbar/NavbarAuthContext";

export const NavbarAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth0();

  return (
    <NavbarAuthContext.Provider
      value={{
        loggedIn: !!user,
        logout: () => logout({ logoutParams: { returnTo: process.env.NEXT_PUBLIC_SITE_URL } }),
      }}
    >
      {children}
    </NavbarAuthContext.Provider>
  );
};
