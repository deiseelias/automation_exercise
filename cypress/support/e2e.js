import 'cypress-mochawesome-reporter/register';
import './commands';
import './checkout';

beforeEach(() => {
  cy.intercept({ hostname: /(^|\.)(doubleclick\.net|googlesyndication\.com|googleadservices\.com)$/ }, {
    statusCode: 204,
    body: '',
  });
  cy.visit('/');
  cy.get('header img[alt="Website for automation practice"]').should('be.visible');
  cy.get('header a[href="/login"]').should('be.visible');
});