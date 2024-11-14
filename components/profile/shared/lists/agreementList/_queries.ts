import { Distribution } from "../../../../../models";
import { AgreementTypes } from "./AgreementList";

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

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
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

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
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

    if (response.status !== 200) {
      return null;
    } else {
      return true;
    }
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
