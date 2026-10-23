import "cypress-localstorage-commands";

Cypress.Commands.add("login", () => {
  Cypress.log({
    name: "loginAuth0",
  });

  // Cypress 16 removed Cypress.env(); credentials are read with cy.env(),
  // which fetches only the requested keys from the Node process.
  cy.env(["AUTH_DOMAIN", "AUTH_USERNAME", "AUTH_PASSWORD"]).then(
    ({ AUTH_DOMAIN, AUTH_USERNAME, AUTH_PASSWORD }) => {
      // Log in through Auth0 Universal Login once per Cypress process (i.e. once
      // per CI container); later specs restore the cached session instead.
      cy.session(
        AUTH_USERNAME,
        () => {
          cy.visit({
            url: "/min-side/",
            headers: {
              "x-vercel-skip-toolbar": "1",
            },
          });

          cy.origin(
            `https://${AUTH_DOMAIN}`,
            { args: { username: AUTH_USERNAME, password: AUTH_PASSWORD } },
            ({ username, password }) => {
              // Click before typing: the login form re-renders while typing, which
              // otherwise sends the password keystrokes to the username field.
              cy.get("input#username").click().type(username);
              cy.get("input#username").should("have.value", username);
              cy.get("input#password").click().type(password, { log: false });
              cy.get("input#password").should(($input) => {
                expect($input.val().length, "password length").to.equal(password.length);
              });
              cy.get("button[type=submit][name=action][value=default]").click();
            },
          );

          cy.location("pathname").should("include", "/min-side");
          cy.window().should((win) => {
            expect(Object.keys(win.localStorage).some(isAuth0TokenKey)).to.equal(true);
          });
        },
        {
          cacheAcrossSpecs: true,
          validate() {
            // Re-run the login if the cached access token is missing or about to expire
            cy.getAllLocalStorage().then((storage) => {
              const expiries = Object.values(storage).flatMap((items) =>
                Object.entries(items)
                  .filter(([key]) => isAuth0TokenKey(key))
                  .map(([, value]) => JSON.parse(value).expiresAt),
              );
              expect(expiries.some((expiresAt) => expiresAt > Date.now() / 1000 + 60)).to.equal(
                true,
              );
            });
          },
        },
      );
    },
  );

  cy.ignorePlausibleTracking();
});

const isAuth0TokenKey = (key) => key.startsWith("@@auth0spajs@@::") && !key.endsWith("::@@user@@");

const getState = () => cy.window().its("store").invoke("getState");

const nextWidgetPane = () => {
  // Panes stay mounted once visited, so several [data-cy=next-button]s can
  // exist at once — .last() is always the currently active pane's.
  cy.get("[data-cy=next-button]").last().click();
  cy.wait(250);
};

const prevWidgetPane = () => {
  cy.get("[data-cy=back-button]").click();
  cy.wait(250);
};

const checkNextIsDisabled = () => {
  cy.get("[data-cy=next-button]").last().should("have.css", "opacity", "0.5");
};

const pickRecurringDonation = () => {
  cy.get("[data-cy=radio-recurring]").click({ force: true });
};

const registerDonationStub = () => {
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
};

const pickSingleDonation = () => {
  cy.get("[data-cy=radio-single]").click({ force: true });
};

const pickAnonymous = () => {
  cy.get("[data-cy=anon-checkbox]").click();
};

const inputDonorValues = () => {
  cy.react("TextInput", { props: { name: "name" } }).type("Cypress Test");
  cy.react("TextInput", { props: { name: "email" } }).type(`cypress@testeffekt.no`);
  cy.get("[data-cy=checkboxTaxDeduction]").click("left");
  cy.get("[data-cy=checkboxNewsletter]").click("left");
  cy.get("[data-cy=checkboxPrivacyPolicy]").click("left");

  cy.react("TextInput", { props: { name: "ssn" } }).type("123456789");
  cy.wait(500);
};

Cypress.Commands.add("getState", getState);
Cypress.Commands.add("nextWidgetPane", nextWidgetPane);
Cypress.Commands.add("prevWidgetPane", prevWidgetPane);
Cypress.Commands.add("checkNextIsDisabled", checkNextIsDisabled);
Cypress.Commands.add("pickRecurringDonation", pickRecurringDonation);
Cypress.Commands.add("pickSingleDonation", pickSingleDonation);
Cypress.Commands.add("pickAnonymous", pickAnonymous);
Cypress.Commands.add("inputDonorValues", inputDonorValues);

Cypress.Commands.add("ignorePlausibleTracking", () => {
  cy.window().then((win) => {
    win.localStorage.setItem("plausible_ignore", "true");
  });
});

export {};
