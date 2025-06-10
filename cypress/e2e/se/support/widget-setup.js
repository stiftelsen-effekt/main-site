// Shared setup for Swedish widget tests
export const setupWidgetTest = () => {
  cy.fixture("cause_areas")
    .then((causeAreas) => {
      cy.intercept("GET", "/causeareas/all", {
        statusCode: 200,
        body: {
          status: 200,
          content: causeAreas,
        },
      });
    })
    .as("getCauseAreas");

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
    headers: {
      "x-vercel-skip-toolbar": "1",
    },
  });
  cy.wait(500);
  cy.get("[data-cy=gi-button]").click();
};

// Common intercepts for donation registration
export const setupDonationIntercepts = () => {
  cy.intercept("POST", "/donations/register", {
    statusCode: 200,
    body: {
      status: 200,
      content: {
        KID: "87397824",
        donorID: 1464,
        hasAnsweredReferral: false,
        paymentProviderUrl: "",
      },
    },
  }).as("registerDonation");

  cy.intercept("PUT", "/autogiro/*/drafted/paymentdate", {
    statusCode: 200,
    body: {
      status: 200,
      content: "OK",
    },
  }).as("draftAutoGiroPaymentDate");

  cy.intercept("POST", "donations/bank/pending", {
    statusCode: 200,
    body: {
      status: 200,
      content: "OK",
    },
  }).as("bankPending");
};

// Helper to fill donor information
export const fillDonorInfo = (name = "Test Person", email = "test@example.com") => {
  cy.get("[data-cy=name-input]").type(name);
  cy.get("[data-cy=email-input]").type(email);
};

// Helper to set cause area amount with optional tip
export const setCauseAreaAmount = (causeAreaId, amount, enableTip = false) => {
  // Use operations input for cause area 4, otherwise use regular pattern
  const selector =
    causeAreaId === 4
      ? "[data-cy=donation-sum-input-operations]"
      : `[data-cy=donation-sum-input-${causeAreaId}]`;

  cy.get(selector).type(amount.toString());

  // Use general tip checkbox or cause area specific one
  const tipSelector =
    causeAreaId === 4 ? "[data-cy=tip-checkbox]" : `[data-cy=tip-checkbox-${causeAreaId}]`;

  if (enableTip) {
    cy.get(tipSelector).check({ force: true });
  } else {
    // Explicitly uncheck tip if it's currently checked
    cy.get(tipSelector).uncheck({ force: true });
  }
};
