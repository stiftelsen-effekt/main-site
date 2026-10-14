import {
  setupWidgetTest,
  setupDonationIntercepts,
  fillDonorInfo,
  setCauseAreaAmount,
  setCut,
  setGlobalCut,
  goToDonorPane,
  backToSelection,
  sumOfShares,
  OPERATIONS_CAUSE_AREA_ID,
} from "./support/widget-setup.js";

// Verifies the /donations/register payload the DK widget builds - cause area and
// organization percentage shares, the operations cut, donor info and the recurring flag.
// Uses cause_areas.json: Global sundhed (1) with orgs 1 (Smart fordeling, standardShare
// 100), 2, 3 and 4; Dyrevelfærd (2) with orgs 10 (Smart fordeling, standardShare 100) and
// 11; Drift (4), the operations cause area, with org 7. Smart distribution splits 60/40
// between Global sundhed and Dyrevelfærd.

const submitWithBank = () => {
  fillDonorInfo();
  cy.get("[data-cy=payment-method-bank]").click({ force: true });
};

const findCauseArea = (body, id) => body.distributionCauseAreas.find((ca) => ca.id === id);

describe("DK Widget - Registration payload", () => {
  beforeEach(() => {
    setupWidgetTest();
    setupDonationIntercepts();
  });

  describe("Single cause area", () => {
    it("Should send 100% to the cause area without a cut", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 100);
      setCut(1, false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(100);
        expect(body.distributionCauseAreas).to.have.length(1);

        const globalHealth = findCauseArea(body, 1);
        expect(globalHealth.name).to.equal("Global sundhed");
        expect(globalHealth.standardSplit).to.be.true;
        expect(parseFloat(globalHealth.percentageShare)).to.equal(100);

        // Standard split sends everything to the cause area's smart distribution org
        expect(sumOfShares(globalHealth.organizations)).to.be.closeTo(100, 0.01);
        const smartOrg = globalHealth.organizations.find((org) => org.id === 1);
        expect(parseFloat(smartOrg.percentageShare)).to.equal(100);

        expect(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID)).to.not.exist;
      });

      cy.wait("@bankPending");
      cy.get("[data-cy=kidNumber]").should("contain.text", "87397824");
    });

    it("Should split out the operations cut", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 1000);
      setCut(1, true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        // The entered amount is the total - the cut is taken out of it, not added on top
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(90, 0.01);

        const operations = findCauseArea(body, OPERATIONS_CAUSE_AREA_ID);
        expect(operations.name).to.equal("Drift");
        expect(operations.standardSplit).to.be.true;
        expect(parseFloat(operations.percentageShare)).to.be.closeTo(10, 0.01);
        expect(operations.organizations).to.have.length(1);
        expect(operations.organizations[0].id).to.equal(7);

        expect(sumOfShares(body.distributionCauseAreas)).to.be.closeTo(100, 0.01);
      });
    });

    it("Should handle very small amounts with a cut", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 20);
      setCut(1, true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(20);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(90, 0.01);
        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
      });
    });

    it("Should only send the currently selected cause area", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, true);

      backToSelection();
      cy.get("[data-cy=cause-area-2]").click();
      setCauseAreaAmount(2, 500);
      setCut(2, false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(500);
        expect(body.distributionCauseAreas).to.have.length(1);
        expect(parseFloat(findCauseArea(body, 2).percentageShare)).to.equal(100);
      });
    });

    it("Should send custom organization shares within the cause area, scaled by the cut", () => {
      cy.get("[data-cy=cause-area-1]").click();
      cy.get("[data-cy=radio-custom-share-1]").click({ force: true });
      cy.get("[data-cy=org-1]").clear();
      cy.get("[data-cy=org-2]").clear().type("600");
      cy.get("[data-cy=org-3]").clear().type("400");
      setCut(1, true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);

        const globalHealth = findCauseArea(body, 1);
        expect(globalHealth.standardSplit).to.be.false;
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(90, 0.01);

        // Organization shares are percentages *within* their cause area, and the cut
        // scales every organization equally, so the entered 600/400 split is preserved
        expect(globalHealth.organizations).to.have.length(2);
        const org2 = globalHealth.organizations.find((org) => org.id === 2);
        const org3 = globalHealth.organizations.find((org) => org.id === 3);
        expect(parseFloat(org2.percentageShare)).to.be.closeTo(60, 0.01);
        expect(parseFloat(org3.percentageShare)).to.be.closeTo(40, 0.01);

        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
      });
    });
  });

  describe("Multiple cause areas", () => {
    beforeEach(() => {
      cy.get("[data-cy=cause-area-multiple]").click();
    });

    it("Should send proportional shares without a cut", () => {
      setCauseAreaAmount(1, 300);
      setCauseAreaAmount(2, 200);
      setGlobalCut(false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(500);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(60, 0.01);
        expect(parseFloat(findCauseArea(body, 2).percentageShare)).to.be.closeTo(40, 0.01);
        expect(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID)).to.be.undefined;
      });
    });

    it("Should keep cause area shares summing to exactly 100 for repeating decimals", () => {
      // 100/300 and 200/300 don't terminate in decimal. Rounding each share independently
      // can drift from exactly 100 (e.g. 100.00000001), which the backend's distribution
      // check rejects with zero tolerance.
      setCauseAreaAmount(1, 100);
      setCauseAreaAmount(2, 200);
      setGlobalCut(false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(300);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(sumOfShares(body.distributionCauseAreas)).to.equal(100);
      });
    });

    it("Should take the global cut proportionally from every cause area", () => {
      setCauseAreaAmount(1, 600);
      setCauseAreaAmount(2, 400);
      setGlobalCut(true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(3);
        // 600 - 10% = 540, 400 - 10% = 360, 100 to operations
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(54, 0.01);
        expect(parseFloat(findCauseArea(body, 2).percentageShare)).to.be.closeTo(36, 0.01);
        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
      });
    });

    it("Should send no operations share after toggling the global cut on and off", () => {
      setCauseAreaAmount(1, 600);
      setCauseAreaAmount(2, 400);
      setGlobalCut(true);
      setGlobalCut(false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID)).to.be.undefined;
      });
    });

    it("Should leave out cause areas with a zero amount", () => {
      setCauseAreaAmount(1, 1000);
      setCauseAreaAmount(2, 0);
      setGlobalCut(true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(90, 0.01);
        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
        expect(findCauseArea(body, 2)).to.be.undefined;
      });
    });

    it("Should send custom organization shares in multiple mode", () => {
      setCauseAreaAmount(1, 1000);
      setGlobalCut(false);
      cy.get("[data-cy=radio-custom-share-1]").click({ force: true });
      cy.get("[data-cy=org-1]").clear();
      cy.get("[data-cy=org-2]").clear().type("600");
      cy.get("[data-cy=org-3]").clear().type("400");
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);

        const globalHealth = findCauseArea(body, 1);
        expect(globalHealth.standardSplit).to.be.false;
        expect(parseFloat(globalHealth.percentageShare)).to.equal(100);

        const org2 = globalHealth.organizations.find((org) => org.id === 2);
        const org3 = globalHealth.organizations.find((org) => org.id === 3);
        expect(parseFloat(org2.percentageShare)).to.equal(60);
        expect(parseFloat(org3.percentageShare)).to.equal(40);
      });
    });

    it("Should handle mixed standard and custom distribution with the global cut", () => {
      setCauseAreaAmount(1, 400);
      cy.get("[data-cy=radio-custom-share-2]").click({ force: true });
      cy.get("[data-cy=org-10]").clear().type("400");
      cy.get("[data-cy=org-11]").clear().type("200");
      setGlobalCut(true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        // 400 + 600 = 1000, 10% (100) to operations taken proportionally
        expect(body.amount).to.equal(1000);

        const globalHealth = findCauseArea(body, 1);
        expect(globalHealth.standardSplit).to.be.true;
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(36, 0.01);

        const animalWelfare = findCauseArea(body, 2);
        expect(animalWelfare.standardSplit).to.be.false;
        expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(54, 0.01);

        // Within Dyrevelfærd, the entered 400/200 split is preserved
        const org10 = animalWelfare.organizations.find((org) => org.id === 10);
        const org11 = animalWelfare.organizations.find((org) => org.id === 11);
        expect(parseFloat(org10.percentageShare)).to.be.closeTo(66.67, 0.01);
        expect(parseFloat(org11.percentageShare)).to.be.closeTo(33.33, 0.01);

        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
        expect(sumOfShares(body.distributionCauseAreas)).to.be.closeTo(100, 0.01);
      });
    });
  });

  it("Should combine amounts from single and multiple selection into one valid split", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 500);

    backToSelection();
    cy.get("[data-cy=cause-area-multiple]").click();
    setCauseAreaAmount(2, 500);
    setGlobalCut(true, 10);
    goToDonorPane();
    submitWithBank();

    cy.wait("@registerDonation").then(({ request: { body } }) => {
      expect(body.amount).to.equal(1000);
      expect(body.distributionCauseAreas).to.have.length(3);
      expect(sumOfShares(body.distributionCauseAreas)).to.be.closeTo(100, 0.01);
    });
  });

  describe("Smart distribution", () => {
    it("Should split by the cause areas' standard percentage shares", () => {
      cy.get("[data-cy=cause-area-recommendation]").click();
      cy.get("[data-cy=donation-sum-input-overall]").type("1000");
      setGlobalCut(false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);

        const globalHealth = findCauseArea(body, 1);
        const animalWelfare = findCauseArea(body, 2);
        expect(globalHealth.standardSplit).to.be.true;
        expect(animalWelfare.standardSplit).to.be.true;
        expect(parseFloat(globalHealth.percentageShare)).to.be.closeTo(60, 0.01);
        expect(parseFloat(animalWelfare.percentageShare)).to.be.closeTo(40, 0.01);
        expect(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID)).to.be.undefined;
      });
    });

    it("Should take the global cut out before splitting", () => {
      cy.get("[data-cy=cause-area-recommendation]").click();
      cy.get("[data-cy=donation-sum-input-overall]").type("1000");
      setGlobalCut(true, 10);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(3);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(54, 0.01);
        expect(parseFloat(findCauseArea(body, 2).percentageShare)).to.be.closeTo(36, 0.01);
        expect(
          parseFloat(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID).percentageShare),
        ).to.be.closeTo(10, 0.01);
      });
    });

    it("Should register preset amounts", () => {
      cy.get("[data-cy=cause-area-recommendation]").click();
      cy.get("[data-cy=suggested-sum-smart-500]").click();
      setGlobalCut(false);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(500);
        expect(sumOfShares(body.distributionCauseAreas)).to.be.closeTo(100, 0.01);
      });
    });

    it("Should not retain the cause area amount or cut from a previous selection", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 500);
      setCut(1, true, 10);

      backToSelection();
      cy.get("[data-cy=cause-area-recommendation]").click();
      cy.get("[data-cy=donation-sum-input-overall]").type("1000");
      setGlobalCut(false);
      goToDonorPane();

      cy.get("[data-cy=summary-smart-distribution]").should("exist");
      cy.get("[data-cy=summary-cause-area-1-amount]").should("not.exist");
      cy.get("[data-cy=summary-cause-area-4-amount]").should("not.exist");

      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.amount).to.equal(1000);
        expect(body.distributionCauseAreas).to.have.length(2);
        expect(parseFloat(findCauseArea(body, 1).percentageShare)).to.be.closeTo(60, 0.01);
        expect(parseFloat(findCauseArea(body, 2).percentageShare)).to.be.closeTo(40, 0.01);
        expect(findCauseArea(body, OPERATIONS_CAUSE_AREA_ID)).to.be.undefined;
      });
    });
  });

  describe("Donor information and settings", () => {
    it("Should send donor email, CPR, tax deduction and newsletter choices", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 200);
      goToDonorPane();

      cy.get("[data-cy=email-input]").type("Donor@Email.DK");
      cy.get("[data-cy=tax-deduction-checkbox]").check({ force: true });
      cy.get("[data-cy=ssn-input]").type("1202900107");
      cy.get("[data-cy=newsletter-checkbox]").check({ force: true });
      cy.get("[data-cy=privacy-policy-checkbox]").check({ force: true });
      cy.get("[data-cy=payment-method-bank]").click({ force: true });

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        const { donor } = body;
        // DK has no name field
        expect(donor.name).to.equal("");
        expect(donor.email).to.equal("donor@email.dk");
        expect(donor.taxDeduction).to.be.true;
        expect(donor.ssn.replace(/\D/g, "")).to.equal("1202900107");
        expect(donor.newsletter).to.be.true;
        expect(body.recurring).to.equal(0);
      });
    });

    it("Should not send a CPR when tax deduction is not selected", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 200);
      goToDonorPane();
      submitWithBank();

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.donor.taxDeduction).to.be.false;
        expect(body.donor.ssn).to.equal("");
        expect(body.donor.newsletter).to.be.false;
      });
    });

    it("Should send the recurring flag for monthly donations", () => {
      cy.get("[data-cy=cause-area-1]").click();
      setCauseAreaAmount(1, 300);
      setCut(1, false);
      cy.get('[data-cy="recurring-donation-radio"]').click({ force: true });
      goToDonorPane();
      fillDonorInfo();

      // Bank transfer is single-donation only in DK; card is available for both
      cy.get("[data-cy=payment-method-quickpay_card]").click({ force: true });

      cy.wait("@registerDonation").then(({ request: { body } }) => {
        expect(body.recurring).to.equal(1);
        expect(body.amount).to.equal(300);
      });
    });
  });
});

describe("DK Widget - Referral code from query params", () => {
  beforeEach(() => {
    setupWidgetTest({ query: { referral: "match-2026" } });
    setupDonationIntercepts();
  });

  it("Should include a referral code from the query string in the registration request", () => {
    cy.get("[data-cy=cause-area-1]").click();
    setCauseAreaAmount(1, 200);
    goToDonorPane();
    submitWithBank();

    cy.wait("@registerDonation").then(({ request: { body } }) => {
      expect(body.referralCode).to.equal("match-2026");
    });
  });
});
