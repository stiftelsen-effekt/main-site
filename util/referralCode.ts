export type ReferralQuery = {
  referral?: string | string[];
  referralCode?: string | string[];
};

const storageKey = "referral-code";

export const firstQueryValue = (value: string | string[] | undefined): string | undefined => {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
};

export const getReferralCodeFromQuery = (query: ReferralQuery): string | undefined =>
  firstQueryValue(query.referral) ?? firstQueryValue(query.referralCode);

export const getReferralCodeFromLocation = (): string | undefined => {
  try {
    const params = new URLSearchParams(window.location.search);
    return (
      firstQueryValue(params.get("referral") ?? undefined) ??
      firstQueryValue(params.get("referralCode") ?? undefined)
    );
  } catch {
    return undefined;
  }
};

export const getStoredReferralCode = (): string | undefined => {
  try {
    return firstQueryValue(window.sessionStorage.getItem(storageKey) ?? undefined);
  } catch {
    return undefined;
  }
};

export const storeReferralCode = (referralCode: string) => {
  try {
    window.sessionStorage.setItem(storageKey, referralCode);
  } catch {
    return;
  }
};
