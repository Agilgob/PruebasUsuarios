Cypress.Commands.add('loginCiudadano', (email, password) => {
    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type(email)
  
    cy.get('input[placeholder="Contraseña"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type(password)
  
    cy.contains('Entrar').should('be.visible')
    cy.contains('Entrar').click()
  })

Cypress.Commands.add('loginFuncionario', (email, password) => {
cy.get('input[placeholder="Correo electrónico"]').as('email')
cy.get('@email').should('be.visible')
cy.get('@email').type(email)

cy.get('input[placeholder="Password"]').as('password')
cy.get('@password').should('be.visible')
cy.get('@password').type(password)

cy.contains('Ingresar').should('be.visible')
cy.contains('Ingresar').click()
})


Cypress.Commands.add('loginErrorMessages', () => {

    cy.get('.notification-error div .message').as('error-message')
    cy.get('@error-message').should('be.visible')
    cy.get('@error-message').should('contain', 'Las credenciales de acceso son inválidas. Inténtalo nuevamente')

})
