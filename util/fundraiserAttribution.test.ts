import { getStoredFundraiserId, storeFundraiserId } from "./fundraiserAttribution";

describe("fundraiser attribution", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  });

  it("keeps the last visited fundraiser across page loads in the same session", () => {
    const values = new Map<string, string>();
    const sessionStorage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
    };
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { sessionStorage },
    });

    expect(getStoredFundraiserId()).toBeUndefined();
    storeFundraiserId("123");
    expect(getStoredFundraiserId()).toBe("123");
    storeFundraiserId("456");
    expect(getStoredFundraiserId()).toBe("456");
  });

  it("omits attribution when storage is unavailable", () => {
    Object.defineProperty(globalThis, "window", { configurable: true, value: undefined });

    expect(() => storeFundraiserId("123")).not.toThrow();
    expect(getStoredFundraiserId()).toBeUndefined();
  });
});
