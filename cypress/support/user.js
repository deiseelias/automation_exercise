export function createUser() {
  const uniqueId = `${Date.now()}-${Cypress._.random(100000, 999999)}`;

  return {
    name: 'Estudante PGATS',
    email: `pgats-${uniqueId}@example.com`,
    password: `Pgats!${uniqueId}`,
    title: 'Mrs',
    birth_date: '15',
    birth_month: '6',
    birth_year: '1995',
    firstname: 'Estudante',
    lastname: 'PGATS',
    company: 'Estudos de Automacao',
    address1: 'Rua dos Testes, 123',
    address2: 'Apartamento 10',
    country: 'Canada',
    state: 'Ontario',
    city: 'Toronto',
    zipcode: 'M5V 1A1',
    mobile_number: '4165550100',
  };
}