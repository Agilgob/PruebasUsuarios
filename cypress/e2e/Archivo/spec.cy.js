// const { beforeEach } = require("mocha")

describe('template spec', () => {

  beforeEach(() => {
    cy.visit('https://sandbox.ciudadano.cjj.gob.mx/')
  })

  it('passes', () => {

    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type('manuel@agilgob.com')

    cy.get('input[placeholder="Contraseña"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type('ERROR')

    cy.contains('Entrar').should('be.visible')
    cy.contains('Entrar').click()

    cy.get('.notification-error div .message').as('error-message')
    cy.get('@error-message').should('be.visible')
    cy.get('@error-message').should('contain', 'Las credenciales de acceso son inválidas. Inténtalo nuevamente')



  })
})

