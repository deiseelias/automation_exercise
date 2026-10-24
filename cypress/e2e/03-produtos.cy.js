describe('TC08 e TC09 - Produtos', () => {
  beforeEach(() => {
    cy.openProducts();
  });

  it('TC08 - exibe a lista e os detalhes do primeiro produto', () => {
    cy.get('.features_items .product-image-wrapper').should('have.length.greaterThan', 0);
    cy.get('.features_items .productinfo p').first().invoke('text').as('productName', { type: 'static' });
    cy.get('.features_items .productinfo h2').first().invoke('text').as('productPrice', { type: 'static' });
    cy.get('.features_items a[href^="/product_details/"]').first().click();
    cy.location('pathname').should('match', /^\/product_details\/\d+$/);
    cy.get('@productName').then((name) => {
      cy.get('.product-information h2').should('be.visible').and('have.text', name);
    });
    cy.get('@productPrice').then((price) => {
      cy.get('.product-information span span').should('be.visible').and('have.text', price);
    });
    ['Category:', 'Availability:', 'Condition:', 'Brand:'].forEach((label) => {
      cy.contains('.product-information p', label).should('be.visible')
        .invoke('text').then((text) => {
          expect(text.replace(label, '').trim(), label).not.to.be.empty;
        });
    });
  });

  it('TC09 - pesquisa e exibe todos os produtos relacionados', () => {
    const searchTerm = 'Blue Top';
    cy.get('.features_items .productinfo p').then(($names) => {
      const expectedNames = $names.toArray().map((element) => element.textContent.trim())
        .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()));
      expect(expectedNames, 'produtos existentes antes da busca').not.to.be.empty;
      cy.get('#search_product').type(searchTerm);
      cy.get('#submit_search').click();
      cy.contains('h2', 'Searched Products', { matchCase: false }).should('be.visible');
      cy.get('.features_items .productinfo p').should('have.length', expectedNames.length)
        .each(($name) => {
          expect($name.text().trim()).to.be.oneOf(expectedNames);
          cy.wrap($name).should('be.visible');
        });
    });
  });
});