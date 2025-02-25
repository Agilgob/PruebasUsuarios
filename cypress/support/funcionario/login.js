
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