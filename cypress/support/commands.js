const apiBody = (body) => (typeof body === 'string' ? JSON.parse(body) : body);

Cypress.Commands.add('getByQa', (value) => cy.get(`[data-qa="${value}"]`));

Cypress.Commands.add('createAccountByApi', (user) => {
  return cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    body: user,
    log: false,
  }).then(({ body }) => {
    expect(apiBody(body), 'criacao da conta de apoio').to.include({
      responseCode: 201,
      message: 'User created!',
    });
  });
});

Cypress.Commands.add('deleteAccountByApi', (user) => {
  return cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email: user.email, password: user.password },
    log: false,
  }).then(({ body }) => {
    expect(apiBody(body).responseCode, 'limpeza: excluida ou ja inexistente')
      .to.be.oneOf([200, 404]);
  });
});

Cypress.Commands.add('openLogin', () => {
  cy.get('header a[href="/login"]').click();
  cy.location('pathname').should('eq', '/login');
  cy.contains('.login-form h2', 'Login to your account').should('be.visible');
  cy.contains('.signup-form h2', 'New User Signup!').should('be.visible');
});

Cypress.Commands.add('login', (user) => {
  cy.getByQa('login-email').type(user.email);
  cy.getByQa('login-password').type(user.password, { log: false });
  cy.getByQa('login-button').click();
});

Cypress.Commands.add('assertLoggedIn', (user) => {
  cy.contains('header li', 'Logged in as').should('be.visible')
    .find('b').should('have.text', user.name);
});

Cypress.Commands.add('register', (user) => {
  cy.getByQa('signup-name').type(user.name);
  cy.getByQa('signup-email').type(user.email);
  cy.getByQa('signup-button').click();
  cy.contains('h2', 'Enter Account Information', { matchCase: false }).should('be.visible');
  cy.get('#id_gender2').check();
  cy.getByQa('name').should('have.value', user.name);
  cy.getByQa('email').should('have.value', user.email).and('be.disabled');
  cy.getByQa('password').type(user.password, { log: false });
  cy.getByQa('days').select(user.birth_date);
  cy.getByQa('months').select(user.birth_month);
  cy.getByQa('years').select(user.birth_year);
  cy.get('#newsletter').check().should('be.checked');
  cy.get('#optin').check().should('be.checked');
  const fields = {
    first_name: user.firstname,
    last_name: user.lastname,
    company: user.company,
    address: user.address1,
    address2: user.address2,
    state: user.state,
    city: user.city,
    zipcode: user.zipcode,
    mobile_number: user.mobile_number,
  };
  Object.entries(fields).forEach(([field, value]) => cy.getByQa(field).type(value));
  cy.getByQa('country').select(user.country);
  cy.getByQa('create-account').click();
  cy.getByQa('account-created').should('be.visible').and('contain.text', 'Account Created!');
  cy.getByQa('continue-button').click();
  cy.assertLoggedIn(user);
});

Cypress.Commands.add('deleteAccount', () => {
  cy.get('header a[href="/delete_account"]').click();
  cy.getByQa('account-deleted').should('be.visible').and('contain.text', 'Account Deleted!');
  cy.getByQa('continue-button').click();
  cy.location('pathname').should('eq', '/');
});