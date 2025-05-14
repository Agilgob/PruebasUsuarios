import { crearPersonasFalsas,  crearUnaPersonaFalsa} from './_faker.js';


Cypress.Commands.add('crearUnaPersonaFalsa', () => {
  return cy.wrap(crearUnaPersonaFalsa());
});

Cypress.Commands.add('crearPersonasFalsas', (cantidad) => {
  return cy.wrap(crearPersonasFalsas(cantidad));
});