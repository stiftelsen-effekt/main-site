// Query parameter that marks which form was just sent when Formspark sends the visitor back
export const SUBMITTED_PARAM = "form_submitted";

/** Whether the page was opened by Formspark's redirect after this form was sent. */
export const wasSubmitted = (pageUrl: string, formId: string): boolean =>
  new URL(pageUrl).searchParams.get(SUBMITTED_PARAM) === formId;

/**
 * Where Formspark should send the visitor after a submission: back to the same page,
 * marked with the form that was sent and scrolled to it. Without this, Formspark shows
 * its own thank-you page and the visitor leaves the site.
 */
export const redirectUrlFor = (pageUrl: string, formId: string): string => {
  const url = new URL(pageUrl);
  url.searchParams.set(SUBMITTED_PARAM, formId);
  url.hash = `form-${formId}`;
  return url.toString();
};
