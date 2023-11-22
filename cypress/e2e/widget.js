import mockDonor from "../fixtures/donor.json";

describe("Widget", () => {
  beforeEach(() => {
    cy.fixture("organizations")
      .then((organizations) => {
        cy.intercept("GET", "/organizations/active", {
          statusCode: 200,
          body: {
            status: 200,
            content: organizations,
          },
        });
      })
      .as("registerDonation");

    cy.fixture("referrals").then((referrals) => {
      cy.intercept("GET", "/referrals/types", {
        statusCode: 200,
        body: {
          status: 200,
          content: referrals,
        },
      }).as("getReferrals");
    });

    cy.visit("/");
    cy.wait(500);
    cy.get("[data-cy=gi-button]").click();
  });

  it("End-2-End single bank donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

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

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("End-2-End recurring bank donation", () => {
    /**
     * Ignore iframeLoaded error on nets iframe
     */
    cy.origin("https://pvu.nets.no", () => {
      cy.on("uncaught:exception", (e) => {
        if (e.message.includes("iframeLoaded is not defined")) {
          // we expected this error, so let's ignore it
          // and let the test continue
          return false;
        }
      });
    });

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickRecurringDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.wait(500);

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
    cy.nextWidgetPane();

    cy.wait(500);

    cy.intercept("POST", "/avtalegiro/draft", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("draftAvtaleGiro");

    cy.get("[data-cy=avtalegiro-form]").submit();
  });

  it("End-2-End single vipps donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=vipps-method]").click({ force: true });
    cy.wait(500);

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
    cy.nextWidgetPane();

    cy.get("[data-cy=vipps-single-button]").within(() => {
      cy.get("button").click({ force: true });
    });
    cy.wait(500);
  });

  it("End-2-End recurring vipps donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickRecurringDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=vipps-method]").click({ force: true });
    cy.wait(500);

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
    cy.nextWidgetPane();

    cy.wait(500);

    cy.intercept("POST", "/vipps/agreement/draft", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("draftVippsAgreement");

    cy.get("[data-cy=vipps-recurring-button]").within(() => {
      cy.get("button").click();
    });
    cy.wait(500);
  });

  it("End-2-End shared donation", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.get("[data-cy=radio-custom-share]").click({ force: true });
    cy.get("[data-cy=org-12]").clear();
    cy.get("[data-cy=org-12]").type(500); // should truncate numbers ove 100
    cy.get("[data-cy=org-12]").type("{moveToStart}");
    cy.get("[data-cy=org-12]").type("-"); // should ignore negative numbers
    cy.get("[data-cy=org-11]").type(50);
    cy.nextWidgetPane();

    cy.pickAnonymous();
    cy.get("[data-cy=bank-method]").click({ force: true });

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

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });
  });

  it("End-2-End for all input fields", () => {
    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.checkNextIsDisabled();
    cy.pickSingleDonation();
    cy.checkNextIsDisabled();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.prevWidgetPane();
    cy.get("[data-cy=donation-sum-input]").clear();
    cy.get("[data-cy=donation-sum-input]").type(0);
    cy.checkNextIsDisabled();
    cy.get("[data-cy=donation-sum-input]").type(1);
    cy.nextWidgetPane();

    cy.wait(500);
    cy.checkNextIsDisabled();
    cy.get("[data-cy=name-input]").type("Donor Name");
    cy.get("[data-cy=email-input]").type("donor@email.com");
    cy.get("[data-cy=tax-deduction-checkbox]").click();
    cy.get("[data-cy=ssn-input]").type("916741057"); // Check 9 digit organization number
    cy.get("[data-cy=newsletter-checkbox]").click();
    cy.get("[data-cy=bank-method]").click({ force: true });

    cy.intercept("POST", "/donations/register", {
      statusCode: 200,
      body: {
        status: 200,
        content: {
          KID: "87397824",
          donorID: 973,
          hasAnsweredReferral: false,
          paymentProviderUrl: "",
        },
      },
    }).as("registerDonation");

    cy.intercept("POST", "donations/bank/pending", {
      statusCode: 200,
      body: {
        status: 200,
        content: "OK",
      },
    }).as("bankPending");

    cy.nextWidgetPane();

    cy.prevWidgetPane();
    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("1234567890"); // 10 digits invalid snn
    cy.checkNextIsDisabled();

    cy.get("[data-cy=ssn-input]").clear();
    cy.get("[data-cy=ssn-input]").type("10915596784"); // 11 digits valid ssn
    cy.get("[data-cy=email-input]").clear();
    cy.get("[data-cy=email-input]").type("incorrect email");
    cy.checkNextIsDisabled();

    cy.get("[data-cy=email-input]").clear();
    cy.get("[data-cy=email-input]").type("donor@email.com");
    cy.nextWidgetPane();

    cy.get("[data-cy=kidNumber]").should(($kid) => {
      const kid = $kid.text();
      expect(kid).to.be.length(8);
    });

    cy.intercept("POST", "/referrals", {
      statusCode: 200,
      body: {
        status: 200,
      },
    }).as("postReferrals");

    cy.get("[data-cy=referral-button-1]").click();
    cy.get("[data-cy=referral-button-10]").click();
    cy.get("[data-cy=referral-text-input]").type("Referral text");
  });

  it("End-2-End for existing donor", () => {
    cy.login();

    cy.intercept("GET", "/donors/*/", {
      statusCode: 200,
      body: {
        status: 200,
        content: mockDonor,
      },
    });

    cy.visit("/min-side");
    cy.wait(500);
    cy.get("[data-cy=send-donation-button]").click();

    const randomSum = Math.floor(Math.random() * 1000) + 100;
    cy.pickSingleDonation();
    cy.get("[data-cy=donation-sum-input]").type(randomSum.toString());
    cy.nextWidgetPane();

    cy.get("[data-cy=name-input]").should("have.value", mockDonor.name);
    cy.get("[data-cy=email-input]").should("have.value", mockDonor.email);

    cy.get("[data-cy=bank-method]").click({ force: true });
    cy.wait(500);

    cy.intercept("POST", "/donations/register", (req) => {
      expect(req.body).to.have.property("donor");
      expect(req.body.donor).to.have.property("email", mockDonor.email);
      expect(req.body.donor).to.have.property("name", mockDonor.name);

      req.reply({
        statusCode: 200,
        body: {
          status: 200,
          content: {
            KID: "87397824",
            donorID: mockDonor.id,
            hasAnsweredReferral: false,
            paymentProviderUrl: "",
          },
        },
      });
    }).as("registerDonation");

    cy.nextWidgetPane();
  });
});
