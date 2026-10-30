import { Distribution } from "../../../../../models";
import { AgreementTypes } from "./AgreementList";

const vippsAgreementUrl = (api: string, donorId: number, agreementId: string, action: string) =>
  `${api}/donors/${donorId}/recurring/vipps/${encodeURIComponent(agreementId)}/${action}`;

export const updateVippsAgreementDistribution = async (
  donorId: number,
  agreementId: string,
  distribution: Distribution,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(vippsAgreementUrl(api, donorId, agreementId, "distribution"), {
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

export const updateVippsAgreementPrice = async (
  donorId: number,
  agreementId: string,
  sum: number,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(vippsAgreementUrl(api, donorId, agreementId, "price"), {
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

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch (e) {
    return null;
  }
};

export const updateVippsAgreementDay = async (
  donorId: number,
  agreementId: string,
  day: number,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(vippsAgreementUrl(api, donorId, agreementId, "chargeday"), {
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

export const cancelVippsAgreement = async (donorId: number, agreementId: string, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(vippsAgreementUrl(api, donorId, agreementId, "cancel"), {
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
        distribution: distribution,
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

export const updateAutoGiroAgreement = async (
  kid: string,
  distribution: Distribution | null,
  paymentDate: number | null,
  amount: number | null,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";
  try {
    const response = await fetch(`${api}/autogiro/${kid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        distribution: distribution,
        paymentDate: paymentDate,
        amount: amount,
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

export const updateDKAgreement = async (
  donorId: number,
  agreementId: string,
  distribution: Distribution | null,
  chargeDay: number | null,
  amount: number | null,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${donorId}/recurring?id=${agreementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        distribution,
        chargeDay,
        amount,
      }),
    });

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch {
    return null;
  }
};

export const cancelDKAgreement = async (donorId: number, agreementId: string, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/donors/${donorId}/recurring/cancel?id=${agreementId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
  } catch {
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

export const cancelAutoGiroAgreement = async (kid: string, token: string) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";
  try {
    const response = await fetch(`${api}/autogiro/${kid}/cancel`, {
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

export const addStoppedAgreementFeedback = async (
  agreementId: string,
  KID: string,
  agreementType: AgreementTypes,
  reasonId: number,
  otherComment: string | undefined,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/agreementfeedback/stopped/${KID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        agreementId: agreementId,
        agreementType: agreementType,
        reasonId: reasonId,
        otherComment: otherComment,
      }),
    });

    const result = await response.json();
    if (response.status !== 200) {
      throw new Error("Failed to add feedback");
    } else {
      return result.content; // Inserted id of the feedback record in DB
    }
  } catch (e) {
    throw new Error("Failed to add feedback");
  }
};

export const deleteStoppedAgreementFeedback = async (
  feedbackId: string,
  KID: string,
  token: string,
) => {
  const api = process.env.NEXT_PUBLIC_EFFEKT_API || "http://localhost:5050";

  try {
    const response = await fetch(`${api}/agreementfeedback/stopped/${KID}/${feedbackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "same-origin",
    });

    // It's also okay if the feedback is not found, as it might have been deleted already
    if (response.status !== 200 && response.status !== 404) {
      throw new Error("Failed to delete feedback");
    } else {
      return true;
    }
  } catch (e) {
    throw new Error("Failed to delete feedback");
  }
};
