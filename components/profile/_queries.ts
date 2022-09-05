import { User } from "@auth0/auth0-react";
import { Donor, FacebookDonationRegistration } from "../../models";

export const save = async (data: Donor, user: User, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${user["https://gieffektivt.no/user-id"]}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify(data),
    });

    const donor: Donor = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return donor;
    }
  } catch (e) {
    return null;
  }
};

export const registerFacebookDonation = async (
  data: FacebookDonationRegistration,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/facebook/register/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return false;
  }
};
