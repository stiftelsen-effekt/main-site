describe("Organizations Page", () => {
  beforeEach(() => {
    cy.fixture("single_cause_area")
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
      url: "/topplista",
      headers: {
        "x-vercel-skip-toolbar": "1",
      },
    });
    cy.wait("@getCauseAreas");
    cy.wait("@getReferrals");
  });

  it("Can open the widget with prefilled distribution", () => {
    cy.wait(100);

    cy.get("[data-cy=organizations-list]").should("exist");
    cy.get('[data-cy="organizations-list-button-1"]').click();

    cy.wait(100);

    cy.get("[data-cy=widget-pane]").should("be.visible");
    cy.pickSingleDonation();

    // The prefilled organization (AMF) tracks 100% of whatever the donor enters,
    // since it's the only organization shown until "Vis alle" is clicked. Custom was picked
    // for the donor here, so the overall sum stays visible as their amount entry.
    cy.get("[data-cy^=donation-sum-input]").should("be.visible");
    cy.get("[data-cy^=donation-sum-input]").type("500");
    cy.get("[data-cy=org-1]").should("have.value", "500");
  });

  it("Should maintain custom chosen distribution when closing and opening widget again", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.pickSingleDonation();

    cy.get("[data-cy=org-1]").clear();
    cy.get("[data-cy=org-1]").type("50");
    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type("50");

    cy.get("[data-cy=close-widget]").click();

    cy.wait(250);

    cy.get("[data-cy=gi-button]").click();

    cy.wait(250);

    cy.get("[data-cy=org-1]").should("have.value", "50");
    cy.get("[data-cy=org-12]").should("have.value", "50");
  });

  it("Should maintain custom chosen distribution when navigating back and forth", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.pickSingleDonation();

    cy.get("[data-cy=org-1]").clear();

    cy.get("[data-cy=org-1]").type("50");
    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type("50");

    // Editing the prefilled amounts makes them the total, so the overall sum - no longer
    // read - is hidden from here on.
    cy.get("[data-cy^=donation-sum-input]").should("not.be.visible");

    cy.nextWidgetPane();

    cy.get("[data-cy=back-button]").click();

    cy.wait(250);

    cy.get("[data-cy=org-1]").should("have.value", "50");
    cy.get("[data-cy=org-12]").should("have.value", "50");
  });

  it("Should have different prefilled distribution if first choosing AMF, then creating a custom distribution, then closing the widget and then choosing HKI", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.pickSingleDonation();

    cy.get("[data-cy=org-1]").clear();
    cy.get("[data-cy=org-1]").type("50");
    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type("50");

    cy.get("[data-cy=close-widget]").click();

    cy.wait(250);

    cy.get('[data-cy="organizations-list-button-10"]').click(); // Clicks the HKI button in the organization list

    cy.wait(250);

    // A freshly prefilled organization tracks 100% of whatever the donor enters next.
    cy.get("[data-cy^=donation-sum-input]").type("200");

    cy.get("[data-cy=org-10]").should("have.value", "200");

    // Zero-amount organizations render an empty input with a "0" placeholder, not a literal "0".
    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-1]").should("have.value", "");
    cy.get("[data-cy=org-12]").should("have.value", "");
  });

  it("End-2-End donation with AMF selected from organization list", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.pickSingleDonation();

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get("[data-cy^=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(randomSum);
      const causeArea = req.body.distributionCauseAreas[0];
      expect(causeArea.id).to.eq(1);
      expect(causeArea.standardSplit).to.eq(false);
      expect(causeArea.organizations).to.deep.equal([
        { id: 1, percentageShare: "100", amount: randomSum },
      ]);

      req.reply({
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
      });
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();
    cy.wait("@registerDonation");
  });

  it("End-2-End donation with AMF selected from organization list and change distribution", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.wait(100);

    cy.pickSingleDonation();

    // Enter the total first so the prefilled AMF share auto-tracks it, then split
    // that exact total between AMF and GiveWell so the custom amounts stay valid.
    cy.get("[data-cy^=donation-sum-input]").type("1000");

    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-1]").clear();
    cy.get("[data-cy=org-1]").type("600");
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type("400");

    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(1000);
      const causeArea = req.body.distributionCauseAreas[0];
      expect(causeArea.id).to.eq(1);
      expect(causeArea.standardSplit).to.eq(false);
      expect(causeArea.organizations).to.deep.equal([
        { id: 12, percentageShare: "40", amount: 400 },
        { id: 1, percentageShare: "60", amount: 600 },
      ]);

      req.reply({
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
      });
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();
    cy.wait("@registerDonation");
  });

  it("End-2-End donation with AMF selected from organization list and change distribution to standard split", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.wait(100);

    cy.pickSingleDonation();

    cy.get("[data-cy=radio-smart-share]").click({ force: true });

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get("[data-cy^=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=payment-method-bank]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(randomSum);
      const causeArea = req.body.distributionCauseAreas[0];
      expect(causeArea.id).to.eq(1);
      expect(causeArea.standardSplit).to.eq(true);
      // Standard split uses each organization's configured standardShare (GiveWell
      // Top Charities Fund is the only one with a nonzero standardShare in the fixture).
      expect(causeArea.organizations).to.deep.equal([
        { id: 12, percentageShare: "100", amount: randomSum },
      ]);

      req.reply({
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
      });
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();
    cy.wait("@registerDonation");
  });
});
