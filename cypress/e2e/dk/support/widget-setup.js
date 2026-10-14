// Shared setup for the Danish (Giv Effektivt) multi-cause-area widget tests.
//
// Widget copy, preset amounts, payment methods and the operations (tip) config come from
// the DK Sanity dataset, not from fixtures. At the time of writing that config is:
// - payment methods: bank + quickpay_card + quickpay_mobilepay for single donations,
//   quickpay_card + dkbank + quickpay_mobilepay for recurring ones
// - no name field, no anonymous option, a required privacy policy checkbox
// - operations cause area id 4, 5% default cut, disabled by default both per cause area
//   and globally
// Tests that assert on cut math always set the cut state and percentage explicitly (see
// setCut/setGlobalCut) so they don't break when those Sanity defaults are changed.

export const OPERATIONS_CAUSE_AREA_ID = 4;
export const OPERATIONS_SUMMARY_LABEL = "Giv Effektivts arbejde og vækst";
export const SINGLE_DONATION_TEXT = "Giv én gang";
export const MONTHLY_DONATION_TEXT = "Giv månedligt";
export const SMART_DISTRIBUTION_TITLE = "Smart fordeling";

export const setupWidgetTest = ({ fixture = "cause_areas", query = {} } = {}) => {
  // The .as() belongs on the intercept, not the fixture, so it can be cy.wait()ed on
  cy.fixture(fixture).then((causeAreas) => {
    cy.intercept("GET", "/causeareas/all", {
      statusCode: 200,
      body: {
        status: 200,
        content: causeAreas,
      },
    }).as("getCauseAreas");
  });

  cy.fixture("referrals").then((referrals) => {
    cy.intercept("GET", "/referrals/types", {
      statusCode: 200,
      body: {
        status: 200,
        content: referrals,
      },
    }).as("getReferrals");
  });

  cy.visit({
    url: "/",
    qs: query,
    headers: {
      "x-vercel-skip-toolbar": "1",
    },
  });

  // Clicking before React has hydrated silently does nothing. Wait for the cause areas
  // to have loaded (client-side only) before interacting, then assert the widget actually
  // opened so a lost click fails right here instead of deep inside a test.
  cy.wait("@getCauseAreas");
  cy.get("[data-cy=gi-button]").should("be.visible").click();
  cy.get("[data-cy=widget-pane]").should("be.visible");
};

export const registerDonationResponse = {
  statusCode: 200,
  body: {
    status: 200,
    content: {
      KID: "87397824",
      donorID: 1464,
      hasAnsweredReferral: false,
      // Empty so card/MobilePay/DK bank don't navigate away to an external provider
      paymentProviderUrl: "",
    },
  },
};

// Common intercepts for donation registration
export const setupDonationIntercepts = () => {
  cy.intercept("POST", "/donations/register", registerDonationResponse).as("registerDonation");

  cy.intercept("POST", "donations/bank/pending", {
    statusCode: 200,
    body: {
      status: 200,
      content: "OK",
    },
  }).as("bankPending");
};

// DK has no name field, and the privacy policy checkbox is required
export const fillDonorInfo = (email = "donor@email.dk") => {
  cy.get("[data-cy=name-input]").should("not.exist");
  cy.get("[data-cy=email-input]").type(email);
  cy.get("[data-cy=privacy-policy-checkbox]").check({ force: true });
};

export const goToDonorPane = () => {
  cy.nextWidgetPane();
  cy.get("[data-cy=email-input]").should("be.visible");
};

// Set a cause area's amount. The operations cause area uses its own input.
export const setCauseAreaAmount = (causeAreaId, amount) => {
  const selector =
    causeAreaId === OPERATIONS_CAUSE_AREA_ID
      ? "[data-cy=donation-sum-input-operations]"
      : `[data-cy=donation-sum-input-${causeAreaId}]`;

  cy.get(selector).type(amount.toString());
};

// Explicitly set a single cause area's operations cut, optionally with a percentage.
// The checkbox can default either way depending on Sanity's enabled_by_default_single,
// so both directions are set actively rather than toggled.
export const setCut = (causeAreaId, enabled, percentage) => {
  const checkbox = `[data-cy=cut-checkbox-${causeAreaId}]`;
  if (enabled) cy.get(checkbox).check({ force: true });
  else cy.get(checkbox).uncheck({ force: true });

  if (enabled && percentage !== undefined) {
    cy.get(`[data-cy=percentage-cut-input-${causeAreaId}]`).type(`{selectall}${percentage}`);
    cy.get(`[data-cy=percentage-cut-input-${causeAreaId}]`).should(
      "have.value",
      percentage.toString(),
    );
  }
};

// Explicitly set the global (multiple cause areas / smart distribution) operations cut
export const setGlobalCut = (enabled, percentage) => {
  if (enabled) cy.get("[data-cy=global-cut-checkbox]").check({ force: true });
  else cy.get("[data-cy=global-cut-checkbox]").uncheck({ force: true });

  if (enabled && percentage !== undefined) {
    cy.get("[data-cy=global-percentage-cut-input]").type(`{selectall}${percentage}`);
    cy.get("[data-cy=global-percentage-cut-input]").should("have.value", percentage.toString());
  }
};

// Go back to the cause area selection pane from the amount pane
export const backToSelection = () => {
  cy.get("[data-cy=back-button]").click();
  cy.get("[data-cy=cause-area-recommendation]").should("be.visible");
};

export const sumOfShares = (entries) =>
  entries.reduce((sum, entry) => sum + parseFloat(entry.percentageShare), 0);

// Summary amounts use toLocaleString, which may emit non-breaking spaces
export const normalizedText = ($el) => $el.text().replace(/\s/g, "");
