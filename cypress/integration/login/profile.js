describe("Login with Auth0", () => {
  before(() => {
    cy.clearLocalStorageSnapshot();
    cy.login();
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.get('h1[class="Donations_header__oe9QR"]').contains("Donasjoner");
  });

  it("Update profile information", () => {
    cy.get('a[href="/profile/details"').click();
  });
});
