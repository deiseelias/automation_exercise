Cypress.Commands.add('openProducts', () => {
  cy.get('header a[href="/products"]').click();
  cy.location('pathname').should('eq', '/products');
  cy.contains('h2', 'All Products', { matchCase: false }).should('be.visible');
  cy.get('.features_items').should('be.visible');
});

Cypress.Commands.add('addProductsToCart', () => {
  cy.openProducts();
  [1, 2].forEach((productId) => {
    cy.get(`.productinfo .add-to-cart[data-product-id="${productId}"]`).click();
    cy.get('#cartModal').should('be.visible');
    cy.contains('#cartModal button', 'Continue Shopping').click();
    cy.get('#cartModal').should('not.be.visible');
  });
  cy.get('header a[href="/view_cart"]').click();
  cy.location('pathname').should('eq', '/view_cart');
  cy.get('#cart_info_table').should('be.visible');
  cy.get('#cart_info_table tbody tr').should('have.length', 2);
  [1, 2].forEach((productId) => {
    cy.get(`#product-${productId} .cart_quantity button`).should('have.text', '1');
  });
});

Cypress.Commands.add('checkout', (user) => {
  cy.contains('a', 'Proceed To Checkout').click();
  cy.location('pathname').should('eq', '/checkout');
  cy.contains('h2', 'Address Details').should('be.visible');
  ['#address_delivery', '#address_invoice'].forEach((selector) => {
    cy.get(selector).should('be.visible').within(() => {
      cy.get('.address_firstname').should('contain.text', `${user.title}. ${user.firstname} ${user.lastname}`);
      [user.company, user.address1, user.address2].forEach((line) => {
        cy.contains('.address_address1', line).should('be.visible');
      });
      cy.get('.address_city').should('contain.text', user.city)
        .and('contain.text', user.state).and('contain.text', user.zipcode);
      cy.get('.address_country_name').should('have.text', user.country);
      cy.get('.address_phone').should('have.text', user.mobile_number);
    });
  });
  cy.contains('h2', 'Review Your Order').should('be.visible');
  cy.get('#cart_info tbody tr[id^="product-"]').should('have.length', 2);
  cy.get('textarea[name="message"]').type('Pedido ficticio para conclusao da disciplina de Automacao Web.');
  cy.contains('a', 'Place Order').click();
  cy.location('pathname').should('eq', '/payment');
  cy.fixture('payment').then((payment) => {
    cy.getByQa('name-on-card').type(payment.name);
    cy.getByQa('card-number').type(payment.number, { log: false });
    cy.getByQa('cvc').type(payment.cvc, { log: false });
    cy.getByQa('expiry-month').type(payment.month);
    cy.getByQa('expiry-year').type(String(new Date().getFullYear() + 2));
  });
  cy.getByQa('pay-button').click();
  cy.location('pathname').should('match', /^\/payment_done\/\d+$/);
  cy.getByQa('order-placed').should('be.visible').and('contain.text', 'Order Placed!');
  cy.contains('p', 'Congratulations! Your order has been confirmed!').should('be.visible');
});