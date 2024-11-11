describe("Organizations Page", () => {
  beforeEach(() => {
    cy.fixture("single_cause_area")
      .then((causeAreas) => {
        cy.intercept("GET", "/causeareas/active", {
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
    cy.get("[data-cy=org-1]").should("have.value", "100"); // Assuming AMF has an ID of 1 in this example
    cy.get('[data-cy="donation-error-texts-container"]').should(($el) => {
      expect($el).to.exist;
      const height = $el.height();
      expect(height).to.be.eq(0);
    });
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

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());

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

    cy.get("[data-cy=org-10]").should("have.value", "100");
    cy.get("[data-cy=org-1]").should("have.value", "0");
    cy.get("[data-cy=org-12]").should("have.value", "0");
  });

  it("End-2-End donation with AMF selected from organization list", () => {
    cy.wait(100);

    cy.get('[data-cy="organizations-list-button-1"]').click(); // Clicks the AMF button in the organization list

    cy.pickSingleDonation();

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(randomSum);
      expect(req.body.distributionCauseAreas).to.deep.equal([
        {
          id: 1,
          name: "Global helse",
          percentageShare: "100",
          standardSplit: false,
          organizations: [
            { id: 12, percentageShare: "0" },
            { id: 1, percentageShare: "100" },
            { id: 10, percentageShare: "0" },
            { id: 4, percentageShare: "0" },
            { id: 7, percentageShare: "0" },
            { id: 13, percentageShare: "0" },
            { id: 14, percentageShare: "0" },
            { id: 11, percentageShare: "0" },
            { id: 15, percentageShare: "0" },
          ],
        },
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

    cy.get("[data-cy=org-1]").clear();
    cy.get("[data-cy=org-1]").type("50");
    cy.get("[data-cy=show-all-organizations-button]").click();
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type("50");

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(randomSum);
      expect(req.body.distributionCauseAreas).to.deep.equal([
        {
          id: 1,
          name: "Global helse",
          percentageShare: "100",
          standardSplit: false,
          organizations: [
            { id: 12, percentageShare: "50" },
            { id: 1, percentageShare: "50" },
            { id: 10, percentageShare: "0" },
            { id: 4, percentageShare: "0" },
            { id: 7, percentageShare: "0" },
            { id: 13, percentageShare: "0" },
            { id: 14, percentageShare: "0" },
            { id: 11, percentageShare: "0" },
            { id: 15, percentageShare: "0" },
          ],
        },
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
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("distributionCauseAreas");

      expect(req.body.amount).to.eq(randomSum);
      // Note that when the standard split is true, the organization percentage shares are ignored on the backend
      expect(req.body.distributionCauseAreas).to.deep.equal([
        {
          id: 1,
          name: "Global helse",
          percentageShare: "100",
          standardSplit: true,
          organizations: [
            { id: 12, percentageShare: "0" },
            { id: 1, percentageShare: "100" },
            { id: 10, percentageShare: "0" },
            { id: 4, percentageShare: "0" },
            { id: 7, percentageShare: "0" },
            { id: 13, percentageShare: "0" },
            { id: 14, percentageShare: "0" },
            { id: 11, percentageShare: "0" },
            { id: 15, percentageShare: "0" },
          ],
        },
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

    cy.nextWidgetPane(); // Navigates to the confirmation pane

    cy.wait("@registerDonation");
  });
});
