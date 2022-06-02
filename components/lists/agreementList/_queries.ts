import { Distribution } from "../../../models";

export const updateVippsAgreementDistribution = async (
  urlCode: string,
  distribution: Distribution,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/distribution`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        distribution: distribution.organizations.map((dist) => ({
          organizationId: dist.id,
          share: dist.share,
        })),
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const updateVippsAgreementPrice = async (urlCode: string, sum: number, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/price`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        price: sum,
      }),
    });

    //const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const updateVippsAgreementDay = async (urlCode: string, day: number, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/chargeDay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        chargeDay: day,
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const cancelVippsAgreement = async (urlCode: string, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const updateAvtalegiroAgreementDistribution = async (
  kid: string,
  distribution: Distribution,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/avtalegiro/${kid}/distribution`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        distribution: distribution.organizations.map((dist) => ({
          organizationId: dist.id,
          share: dist.share,
        })),
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const updateAvtaleagreementPaymentDay = async (kid: string, day: number, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/avtalegiro/${kid}/paymentdate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        paymentDate: day,
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return result.content;
    }
  } catch (e) {
    return null;
  }
};

export const updateAvtaleagreementAmount = async (kid: string, sum: number, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/avtalegiro/${kid}/amount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        amount: sum,
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return result.content;
    }
  } catch (e) {
    return null;
  }
};

export const cancelAvtaleGiroAgreement = async (kid: string, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/avtalegiro/${kid}/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        active: 0,
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};
