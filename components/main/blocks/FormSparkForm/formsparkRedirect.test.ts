import { SUBMITTED_PARAM, redirectUrlFor, wasSubmitted } from "./formsparkRedirect";

describe("redirectUrlFor", () => {
  it("returns to the same page, marked with the form and scrolled to it", () => {
    expect(redirectUrlFor("https://giveffektivt.dk/kontakt", "WWNT7BA8")).toBe(
      `https://giveffektivt.dk/kontakt?${SUBMITTED_PARAM}=WWNT7BA8#form-WWNT7BA8`,
    );
  });

  it("keeps the other query parameters and replaces an earlier mark and anchor", () => {
    expect(
      redirectUrlFor(
        `https://giveffektivt.dk/kontakt?utm_source=mail&${SUBMITTED_PARAM}=OLD#top`,
        "WWNT7BA8",
      ),
    ).toBe(
      `https://giveffektivt.dk/kontakt?utm_source=mail&${SUBMITTED_PARAM}=WWNT7BA8#form-WWNT7BA8`,
    );
  });
});

describe("wasSubmitted", () => {
  it("is true when the page carries the mark of this form", () => {
    expect(wasSubmitted(redirectUrlFor("https://giveffektivt.dk/kontakt", "A"), "A")).toBe(true);
  });

  it("is false for another form on the same page", () => {
    expect(wasSubmitted(redirectUrlFor("https://giveffektivt.dk/kontakt", "A"), "B")).toBe(false);
  });

  it("is false when the page was opened normally", () => {
    expect(wasSubmitted("https://giveffektivt.dk/kontakt", "A")).toBe(false);
  });
});
