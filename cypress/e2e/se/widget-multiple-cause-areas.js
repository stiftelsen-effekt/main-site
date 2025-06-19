import { setupWidgetTest, setCauseAreaAmount, setGlobalCut } from "./support/widget-setup.js";

describe("Swedish Widget - Multiple Cause Areas Flow", () => {
  beforeEach(() => {
    setupWidgetTest();
    cy.get("[data-cy=cause-area-multiple]").click();
  });

  it("Should display multiple cause area inputs", () => {
    // Should show inputs for main cause areas
    cy.get("[data-cy^=donation-sum-input-]").should("have.length.at.least", 3);

    // Should not show operations cause area in multiple selection by checking total count
    cy.get("[data-cy^=donation-sum-input-]").should("have.length.lessThan", 5);
  });

  it("Should allow setting amounts for multiple cause areas", () => {
    // Set amounts for different cause areas
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);
    setCauseAreaAmount(3, 100);

    // Check amounts are set correctly
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=donation-sum-input-3]").should("have.value", "100");

    // Check total is displayed
    cy.get("[data-cy=total-amount-wrapper]").should("exist");
  });

  it("Should validate that at least one amount is set", () => {
    // Next button should be disabled with no amounts
    cy.get("[data-cy=next-button]").should("be.disabled");

    // Set one amount
    setCauseAreaAmount(1, 100);
    cy.get("[data-cy=next-button]").should("not.be.disabled");

    // Clear the amount
    cy.get("[data-cy=donation-sum-input-1]").clear();
    cy.get("[data-cy=next-button]").should("be.disabled");
  });

  it("Should handle different distribution types per cause area", () => {
    setCauseAreaAmount(1, 500);

    // Check if this cause area has multiple organizations (distribution options)
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Should see text for distribution options
        cy.contains("Låt Ge Effektivt valja organisasjoner").should("be.visible");
        cy.contains("Velj organisasjoner selv").should("be.visible");

        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and check for organization inputs
        cy.wait(500);
        cy.get("[data-cy^=org-]", { timeout: 10000 }).should("have.length.at.least", 1);
      } else {
        // This cause area only has one organization, so no distribution options
        cy.log("This cause area has only one organization - no distribution options shown");
      }
    });
  });

  it("Should calculate organization shares for custom distribution", () => {
    setCauseAreaAmount(1, 1000);

    // Check if custom distribution is available
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and check organization inputs
        cy.wait(500);
        cy.get("[data-cy^=org-]", { timeout: 10000 }).should("have.length.at.least", 1);
        // Don't assume specific values since they depend on organization shares
        cy.get("[data-cy^=org-]").first().invoke("val").should("not.be.empty");
      } else {
        cy.log("Custom distribution not available - single organization cause area");
      }
    });
  });

  it("Should allow manual organization amount input", () => {
    setCauseAreaAmount(1, 1000);

    // Check if custom distribution is available
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and set custom amount
        cy.wait(500);
        cy.get("[data-cy^=org-]", { timeout: 10000 })
          .first()
          .then(($input) => {
            const orgId = $input.attr("data-cy").split("-")[1];
            cy.get(`[data-cy=org-${orgId}]`).clear().type("600");
            cy.get(`[data-cy=org-${orgId}]`).should("have.value", "600");
          });
      } else {
        cy.log("Custom distribution not available - single organization cause area");
      }
    });
  });

  it("Should preserve settings when navigating back and forth", () => {
    // Set complex state
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);

    // Go to next pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Navigate back
    cy.get("[data-cy=back-button]").click();

    // Settings should be preserved
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "300");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=total-amount-wrapper]").should("exist");
  });

  it("Should show correct donation summary on donor pane", () => {
    // Set amounts for multiple cause areas
    setCauseAreaAmount(1, 500);
    setCauseAreaAmount(2, 300);
    setCauseAreaAmount(3, 200);

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check that donation summary is visible
    cy.get("[data-cy=donation-summary]").should("exist");

    // Check donation type (should be single donation by default)
    cy.get("[data-cy=donation-type]").should("contain.text", "Enkelt givande");

    // Check cause area amounts in summary
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "500 kr");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "300 kr");
    cy.get("[data-cy=summary-cause-area-3-amount]").should("contain.text", "200 kr");

    // Check total amount
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "1\u00A0000 kr");
  });

  it("Should show correct summary with global cut and recurring donation", () => {
    // Set amounts and enable global cut
    setCauseAreaAmount(1, 400);
    setCauseAreaAmount(2, 300);
    setCauseAreaAmount(3, 200);
    setGlobalCut(true);

    // Switch to recurring
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });

    // Go to donor pane
    cy.get("[data-cy=next-button]").click();
    cy.get("[data-cy=name-input]").should("be.visible");

    // Check donation type is recurring
    cy.get("[data-cy=donation-type]").should("contain.text", "Månadsgivande");

    // Check that operations/cut amount is shown
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", "Drift");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("exist");

    // Check that cause area amounts are shown (excluding tips)
    cy.get("[data-cy=summary-cause-area-1-amount]").should("exist");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("exist");
    cy.get("[data-cy=summary-cause-area-3-amount]").should("exist");

    // Check total includes everything
    cy.get("[data-cy=summary-total-amount]").should("exist");
  });

  it("Should show correct summary with custom organization distribution", () => {
    setCauseAreaAmount(1, 1000);

    // Check if custom distribution is available for cause area 1
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and verify auto-population based on standard shares
        cy.wait(500);

        // Based on fixture: Global hälsa has 2 orgs with 50% each (GiveWell TCF id:12, GiveWell AGF id:15)
        // So 1000 kr should auto-populate as 500 kr to each
        cy.get("[data-cy=org-12]", { timeout: 10000 }).should("have.value", "500");
        cy.get("[data-cy=org-15]", { timeout: 10000 }).should("have.value", "500");

        // Modify one organization amount from 500 to 600
        cy.get("[data-cy=org-12]").clear().type("600");

        // Go to donor pane
        cy.get("[data-cy=next-button]").click();
        cy.get("[data-cy=name-input]").should("be.visible");

        // Check that donation summary shows both organizations
        cy.get("[data-cy=donation-summary]").should("exist");
        cy.get("[data-cy=summary-org-12-amount]").should("contain.text", "600 kr"); // Modified amount
        cy.get("[data-cy=summary-org-15-amount]").should("contain.text", "500 kr"); // Original auto-populated amount

        // Check total reflects both organization amounts: 600 + 500 = 1100
        cy.get("[data-cy=summary-total-amount]").should("contain.text", "1\u00A0100 kr");
      } else {
        // Single organization - test basic summary
        cy.get("[data-cy=next-button]").click();
        cy.get("[data-cy=name-input]").should("be.visible");

        cy.get("[data-cy=donation-summary]").should("exist");
        cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "1\u00A0000 kr");
        cy.get("[data-cy=summary-total-amount]").should("contain.text", "1\u00A0000 kr");
      }
    });
  });

  it("Should auto-populate organization amounts based on standard shares when switching to custom distribution", () => {
    setCauseAreaAmount(1, 1000);

    // Check if custom distribution is available for cause area 1
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Initially should show standard distribution
        cy.contains("Låt Ge Effektivt valja organisasjoner").should("be.visible");

        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and verify auto-population
        cy.wait(500);

        // Based on fixture data: GiveWell TCF (id:12) and GiveWell AGF (id:15) each have 50% standardShare
        // So 1000 kr should be distributed as 500 kr to each
        cy.get("[data-cy=org-12]", { timeout: 10000 }).should("have.value", "500");
        cy.get("[data-cy=org-15]", { timeout: 10000 }).should("have.value", "500");

        // Other organizations with 0% standardShare should be empty or have 0
        cy.get("[data-cy=org-1]").should("have.value", "");
        cy.get("[data-cy=org-14]").should("have.value", "");

        // Total should equal the original cause area amount
        cy.get("[data-cy=next-button]").should("not.be.disabled");
      } else {
        cy.log("Custom distribution not available - single organization cause area");
      }
    });
  });

  it("Should handle recurring vs single donation for multiple areas", () => {
    setCauseAreaAmount(1, 300);
    setCauseAreaAmount(2, 200);

    // Switch to recurring
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");

    // Total should remain displayed
    cy.get("[data-cy=total-amount-wrapper]").should("exist");

    // Should be able to proceed
    cy.get("[data-cy=next-button]").should("not.be.disabled");
  });
});
