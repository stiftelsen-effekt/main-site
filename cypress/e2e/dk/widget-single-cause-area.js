import {
  setupWidgetTest,
  setCauseAreaAmount,
  setCut,
  goToDonorPane,
  OPERATIONS_SUMMARY_LABEL,
  SINGLE_DONATION_TEXT,
  MONTHLY_DONATION_TEXT,
} from "./support/widget-setup.js";

describe("DK Widget - Single Cause Area Flow", () => {
  beforeEach(() => {
    setupWidgetTest();
  });

  it("Should allow amount input for single cause area", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500);
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should handle suggested amounts", () => {
    cy.get("[data-cy=cause-area-1]").click();

    // 500 kr is the first DK single-donation preset in Sanity
    cy.get("[data-cy=suggested-sum-1-500]").click();
    cy.get("[data-cy=donation-sum-input-1]").should("have.value", "500");
  });

  it("Should validate minimum amount", () => {
    cy.get("[data-cy=cause-area-1]").click();

    cy.get("[data-cy=next-button]").last().should("be.disabled");

    cy.get("[data-cy=donation-sum-input-1]").type("0");
    cy.get("[data-cy=next-button]").last().should("be.disabled");

    cy.get("[data-cy=donation-sum-input-1]").clear().type("100");
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");
  });

  it("Should advance to donor pane with the DK donor fields", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500);

    goToDonorPane();

    // DK has no name field and doesn't offer anonymous donations, but requires
    // accepting the privacy policy
    cy.get("[data-cy=name-input]").should("not.exist");
    cy.get("[data-cy=anon-checkbox]").should("not.exist");
    cy.get("[data-cy=privacy-policy-checkbox]").should("exist");
    cy.get("[data-cy=tax-deduction-checkbox]").should("exist");
  });

  it("Should handle operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();
    cy.get("[data-cy=donation-sum-input-operations]").type("200");
    cy.get("[data-cy=donation-sum-input-operations]").should("have.value", "200");
    cy.get("[data-cy=next-button]").last().should("not.be.disabled");
  });

  it("Should display recurring vs single donation options, defaulting to single", () => {
    cy.get("[data-cy=cause-area-1]").click();

    cy.get('[data-cy="single-donation-radio"]').should("exist");
    cy.get('[data-cy="recurring-donation-radio"]').should("exist");
    cy.get('[data-cy="single-donation-radio"]').should("be.checked");
  });

  it("Should switch between recurring and single donation", () => {
    cy.get("[data-cy=cause-area-1]").click();

    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    cy.get('[data-cy="recurring-donation-radio"]').should("be.checked");

    cy.get('[data-cy="single-donation-radio"]').click({ force: true });
    cy.get('[data-cy="single-donation-radio"]').should("be.checked");
  });

  it("Should show correct donation summary for single cause area", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 750);
    setCut(1, false);

    goToDonorPane();

    cy.get("[data-cy=donation-summary]").should("exist");
    cy.get("[data-cy=donation-type]").should("contain.text", SINGLE_DONATION_TEXT);
    cy.get("[data-cy=summary-cause-area-1-name]").should("contain.text", "Global sundhed");
    cy.get("[data-cy=summary-cause-area-1-amount]").should("contain.text", "750 kr");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("not.exist");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "750 kr");
  });

  it("Should show correct summary for single cause area with cut and recurring", () => {
    cy.get("[data-cy=cause-area-2]").click();
    cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
    setCauseAreaAmount(2, 500);
    setCut(2, true, 10);

    goToDonorPane();

    cy.get("[data-cy=donation-type]").should("contain.text", MONTHLY_DONATION_TEXT);
    cy.get("[data-cy=summary-cause-area-2-name]").should("contain.text", "Dyrevelfærd");
    cy.get("[data-cy=summary-cause-area-2-amount]").should("contain.text", "450 kr");
    // The cut line is labelled from ui_labels.operations_summary_label, not the
    // operations cause area's own name
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", OPERATIONS_SUMMARY_LABEL);
    cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "50 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "500 kr");
  });

  it("Should show correct summary for operations cause area", () => {
    cy.get("[data-cy=cause-area-4]").click();
    cy.get("[data-cy=donation-sum-input-operations]").type("150");

    goToDonorPane();

    // Selected directly, operations is listed under its own cause area name
    cy.get("[data-cy=summary-cause-area-4-name]").should("contain.text", "Drift");
    cy.get("[data-cy=summary-cause-area-4-amount]").should("contain.text", "150 kr");
    cy.get("[data-cy=summary-total-amount]").should("contain.text", "150 kr");
  });
});
