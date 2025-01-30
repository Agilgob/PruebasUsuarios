// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  cy.visit('https://sandbox.ciudadano.cjj.gob.mx/')
  cy.get('input[placeholder="Correo electrónico"]').as('email')
  cy.get('@email').should('be.visible')
  cy.get('@email').type(email)

  cy.get('input[placeholder="Contraseña"]').as('password')
  cy.get('@password').should('be.visible')
  cy.get('@password').type(password)

  cy.contains('Entrar').should('be.visible')
  cy.contains('Entrar').click()
})

Cypress.Commands.add('loginErrorMessages', () => {

    cy.get('.notification-error div .message').as('error-message')
    cy.get('@error-message').should('be.visible')
    cy.get('@error-message').should('contain', 'Las credenciales de acceso son inválidas. Inténtalo nuevamente')

})
