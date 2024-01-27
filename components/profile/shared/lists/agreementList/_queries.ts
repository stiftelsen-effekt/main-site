import { Distribution } from "../../../../../models";

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
        distribution: distribution,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
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
        price: sum * 100,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
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

    return {
      ok: response.ok,
      status: response.status,
    };
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

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return null;
  }
};

export const updateAnonymousVippsAgreementDistribution = async (
  urlCode: string,
  distribution: Distribution,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/distribution`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        distribution: distribution,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return null;
  }
};

export const updateAnonymousVippsAgreementPrice = async (urlCode: string, sum: number) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/price`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        price: sum * 100,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return null;
  }
};

export const updateAnonymousVippsAgreementDay = async (urlCode: string, day: number) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/chargeDay`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({
        chargeDay: day,
      }),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return null;
  }
};

export const cancelAnonymousVippsAgreement = async (urlCode: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/vipps/agreement/${urlCode}/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    });

    return {
      ok: response.ok,
      status: response.status,
    };
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
      body: JSON.stringify(distribution),
    });

    return {
      ok: response.ok,
      status: response.status,
    };
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

    return {
      ok: response.ok,
      status: response.status,
    };
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

    return {
      ok: response.ok,
      status: response.status,
    };
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

    return {
      ok: response.ok,
      status: response.status,
    };
  } catch (e) {
    return null;
  }
};
