import { User } from "@auth0/auth0-react";
import { mutate } from "swr";
import { getUserId } from "../../lib/user";
import { Donor, FacebookDonationRegistration, TaxUnit } from "../../models";

export const save = async (data: Donor, user: User, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${getUserId(user)}/`, {
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

export const createTaxUnit = async (
  data: Partial<TaxUnit>,
  user: User,
  token: string,
): Promise<TaxUnit | string | false> => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${getUserId(user)}/taxunits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        name: data.name,
        ssn: data.ssn,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      mutate(`/donors/${getUserId(user)}/taxunits/`);
      return data.content;
    } else {
      const data = await response.json();
      return data.content;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const updateTaxUnit = async (
  data: TaxUnit,
  user: User,
  token: string,
): Promise<TaxUnit | string | false> => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${getUserId(user)}/taxunits/${data.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        taxUnit: data,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      mutate(`/donors/${getUserId(user)}/taxunits/`);
      return data.content;
    } else {
      const data = await response.json();
      return data.content;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const deleteTaxUnit = async (
  data: { unit: TaxUnit; transferUnit: TaxUnit | null },
  user: User,
  token: string,
): Promise<string | boolean> => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${getUserId(user)}/taxunits/${data.unit.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        transferId: data.transferUnit?.id || null,
      }),
    });

    if (response.status === 200) {
      const data = await response.json();
      mutate(`/donors/${getUserId(user)}/taxunits/`);
      return true;
    } else {
      const data = await response.json();
      return data.content;
    }
  } catch (e) {
    console.error(e);
    return false;
  }
};
