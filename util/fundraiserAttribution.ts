const storageKey = "fundraiser-id";

export const storeFundraiserId = (fundraiserId: string) => {
  try {
    window.sessionStorage.setItem(storageKey, fundraiserId);
  } catch {
    return;
  }
};

export const getStoredFundraiserId = (): string | undefined => {
  try {
    return window.sessionStorage.getItem(storageKey) || undefined;
  } catch {
    return undefined;
  }
};
