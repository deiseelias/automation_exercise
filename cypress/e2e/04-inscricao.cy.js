import { createUser } from '../support/user';

describe('TC10 - Inscricao na pagina inicial', () => {
  it('TC10 - inscreve um email na newsletter', () => {
    cy.get('footer').scrollIntoView();
    cy.contains('footer h2', 'Subscription', { matchCase: false }).should('be.visible');
    cy.get('#susbscribe_email').type(createUser().email);
    cy.get('#subscribe').click();
    cy.contains('#success-subscribe', 'You have been successfully subscribed!')
      .should('be.visible');
  });
});