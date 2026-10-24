import { createUser } from '../support/user';

describe('TC15 e TC16 - Compras', () => {
  let user;

  beforeEach(() => {
    user = createUser();
  });

  afterEach(() => {
    cy.deleteAccountByApi(user);
  });

  it('TC15 - realiza compra apos cadastrar uma conta pela interface', () => {
    cy.openLogin();
    cy.register(user);
    cy.addProductsToCart();
    cy.checkout(user);
    cy.deleteAccount();
  });

  it('TC16 - realiza compra apos autenticar uma conta existente', () => {
    cy.createAccountByApi(user);
    cy.openLogin();
    cy.login(user);
    cy.assertLoggedIn(user);
    cy.addProductsToCart();
    cy.checkout(user);
    cy.deleteAccount();
  });
});