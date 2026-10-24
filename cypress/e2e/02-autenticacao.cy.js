import { createUser } from '../support/user';

describe('TC02 a TC05 - Autenticacao', () => {
  describe('Conta existente', () => {
    let user;

    beforeEach(() => {
      user = createUser();
      cy.createAccountByApi(user);
      cy.openLogin();
    });

    afterEach(() => {
      cy.deleteAccountByApi(user);
    });

    it('TC02 - autentica com credenciais corretas e exclui a conta', () => {
      cy.login(user);
      cy.assertLoggedIn(user);
      cy.deleteAccount();
    });

    it('TC04 - encerra a sessao e retorna para a pagina de login', () => {
      cy.login(user);
      cy.assertLoggedIn(user);
      cy.get('header a[href="/logout"]').click();
      cy.location('pathname').should('eq', '/login');
      cy.contains('.login-form h2', 'Login to your account').should('be.visible');
      cy.contains('header li', 'Logged in as').should('not.exist');
      cy.get('header a[href="/login"]').should('be.visible');
    });

    it('TC05 - rejeita cadastro com email ja registrado', () => {
      cy.getByQa('signup-name').type(user.name);
      cy.getByQa('signup-email').type(user.email);
      cy.getByQa('signup-button').click();
      cy.contains('.signup-form', 'Email Address already exist!').should('be.visible');
      cy.location('pathname').should('eq', '/signup');
    });
  });

  it('TC03 - rejeita email e senha incorretos', () => {
    const invalidUser = createUser();
    cy.openLogin();
    cy.login(invalidUser);
    cy.contains('.login-form', 'Your email or password is incorrect!').should('be.visible');
    cy.location('pathname').should('eq', '/login');
    cy.contains('header li', 'Logged in as').should('not.exist');
  });
});