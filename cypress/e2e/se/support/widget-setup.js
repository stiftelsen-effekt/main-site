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

// Helper to set cause area amount with optional cut
export const setCauseAreaAmount = (causeAreaId, amount, enableCut = false) => {
  // Use operations input for cause area 4, otherwise use regular pattern
  const selector =
    causeAreaId === 4
      ? "[data-cy=donation-sum-input-operations]"
      : `[data-cy=donation-sum-input-${causeAreaId}]`;

  cy.get(selector).type(amount.toString());

  if (enableCut) {
    // Check if we're in multiple cause areas mode (global cut) or single cause area mode
    cy.get("body").then(($body) => {
      if ($body.find("[data-cy=global-cut-checkbox]").length > 0) {
        // Multiple cause areas mode - use global cut toggle
        cy.get("[data-cy=global-cut-checkbox]").check({ force: true });
      } else {
        // Single cause area mode - use specific cut checkbox
        const cutSelector =
          causeAreaId === 4 ? "[data-cy=cut-checkbox]" : `[data-cy=cut-checkbox-${causeAreaId}]`;
        cy.get(cutSelector).check({ force: true });
      }
    });
  }
};

// Helper specifically for multiple cause areas global cut toggle
export const setGlobalCut = (enable = true) => {
  if (enable) {
    cy.get("[data-cy=global-cut-checkbox]").check({ force: true });
  } else {
    cy.get("[data-cy=global-cut-checkbox]").uncheck({ force: true });
  }
};

// Helper to set custom cut amount
export const setCustomCutAmount = (amount, causeAreaId = null) => {
  if (causeAreaId) {
    // Single cause area mode
    cy.get(`[data-cy=custom-cut-input-${causeAreaId}]`).clear().type(amount.toString());
  } else {
    // Multiple cause areas mode
    cy.get("[data-cy=global-custom-cut-input]").clear().type(amount.toString());
  }
};
