import { setupWidgetTest, setCauseAreaAmount } from "./support/widget-setup.js";

describe("Swedish Widget - State Persistence", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should persist state when navigating between different cause areas", () => {
    // Select Global hälsa (ID 1)
    cy.get("[data-cy=cause-area-1]").click();

    // Set amount for Global hälsa
    setCauseAreaAmount(1, 500, true);

    // Go back to selection
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);

    // Select Djurvälfärd (ID 2)
    cy.get("[data-cy=cause-area-2]").click();

    // Set amount for Djurvälfärd
    setCauseAreaAmount(2, 300);

    // Go back to selection
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);

    // Return to Global hälsa - state should be preserved
    cy.get("[data-cy=cause-area-1]").click();

    // Check that Global hälsa amount and tip are preserved
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "525"); // 500 + 5% tip = 525 total
    cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

    // Go back and check Djurvälfärd state is also preserved
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-2]").click();
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "300");
  });

  it("Should maintain state across full navigation flow", () => {
    // Set up complex state with multiple cause areas
    cy.get("[data-cy=cause-area-multiple]").click();

    // Set amounts and tips for multiple areas
    setCauseAreaAmount(1, 300, true);
    setCauseAreaAmount(2, 200); // No tip
    setCauseAreaAmount(3, 150, true);

    // Navigate to donor pane
    cy.get("[data-cy=next-button]").click();

    // Go back to cause selection
    cy.get("[data-cy=back-button]").click();

    // Check that all state is preserved
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "315"); // 300 + 5% tip
    cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=tip-checkbox-2]").should("not.be.checked");

    cy.get("[data-cy=donation-sum-input-3]").should("have.value", "158"); // 150 + ~5% tip
    cy.get("[data-cy=tip-checkbox-3]").should("be.checked");

    // Switch to single cause area and back
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-1]").click();

    // Should show the amount from multiple selection
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "315");
    cy.get("[data-cy=tip-checkbox-1]").should("be.checked");

    // Go back to multiple and verify everything is still there
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-multiple]").click();

    // All amounts should still be preserved
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "315");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "200");
    cy.get("[data-cy=donation-sum-input-3]").should("have.value", "158");
  });

  it("Should preserve organization distribution settings", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 1000);

    // Check if this cause area has multiple organizations
    cy.get("body").then(($body) => {
      if ($body.find('input[type="radio"]').length > 1) {
        // Switch to custom distribution
        cy.contains("Velj organisasjoner selv").click();

        // Wait for animation and set custom organization amount
        cy.wait(500);
        cy.get("[data-cy^=org-]", { timeout: 10000 })
          .first()
          .then(($input) => {
            const orgId = $input.attr("data-cy").split("-")[1];
            cy.get(`[data-cy=org-${orgId}]`).clear().type("600");

            // Navigate away and back
            cy.get("[data-cy=back-button]").click();
            cy.wait(500);
            cy.get("[data-cy=cause-area-1]").click();

            // Custom distribution and amount should be preserved
            cy.contains("Velj organisasjoner selv").parent().find("input").should("be.checked");
            cy.get(`[data-cy=org-${orgId}]`).should("have.value", "600");
          });
      } else {
        // Single organization - test basic state persistence
        cy.log("Single organization cause area - testing basic state persistence");

        // Navigate away and back
        cy.get("[data-cy=back-button]").click();
        cy.wait(500);
        cy.get("[data-cy=cause-area-1]").click();

        // Amount should be preserved
        cy.get("[data-cy=donation-sum-input-1]").should("have.value", "1000");
      }
    });
  });

  it("Should preserve recurring donation preference", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // Switch to recurring donation
    cy.get('input[value="1"]').click();
    setCauseAreaAmount(1, 500);

    // Navigate away and back
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-1]").click();

    // Should still be set to recurring
    cy.get('input[value="1"]').should("be.checked");
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should handle complex cross-navigation scenarios", () => {
    // Start with single cause area
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 400, true);
    cy.get('input[value="1"]').click(); // Set to recurring

    // Go to multiple cause areas
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-multiple]").click();

    // Should inherit settings from single selection
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "420"); // 400 + tip
    cy.get("[data-cy=tip-checkbox-1]").should("be.checked");
    cy.get('input[value="1"]').should("be.checked"); // Recurring

    // Add more cause areas
    setCauseAreaAmount(2, 250);
    setCauseAreaAmount(3, 150, true);

    // Go to operations cause area
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-4]").click();
    setCauseAreaAmount(4, 100);

    // Return to multiple and verify everything is preserved
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-multiple]").click();

    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "420");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "250");
    cy.get("[data-cy=donation-sum-input-3]").should("have.value", "158"); // 150 + tip
    cy.get('input[value="1"]').should("be.checked");
  });

  it("Should reset state only when smart distribution is selected", () => {
    // Set up some state
    cy.get("[data-cy=cause-area-multiple]").click();
    setCauseAreaAmount(1, 300, true);
    setCauseAreaAmount(2, 200);

    // Go back and select smart distribution
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-recommendation]").click();

    // Should reset to smart distribution mode
    cy.get("[data-cy=donation-sum-input-overall]").should("have.value", "");

    // Go back to multiple - previous state should be cleared
    cy.get("[data-cy=back-button]").click();
    cy.wait(500);
    cy.get("[data-cy=cause-area-multiple]").click();

    // Should start fresh
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "");
    cy.get("[data-cy=donation-sum-input-2]").should("have.value", "");
  });
});
