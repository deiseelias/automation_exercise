import { createUser } from '../support/user';

describe('TC01 - Cadastro de usuario', () => {
  let user;

  beforeEach(() => {
    user = createUser();
  });

  afterEach(() => {
    cy.deleteAccountByApi(user);
  });

  it('TC01 - cadastra uma conta completa e a exclui pela interface', () => {
    cy.openLogin();
    cy.register(user);
    cy.deleteAccount();
  });
});