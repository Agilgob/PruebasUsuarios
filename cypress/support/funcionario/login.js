
Cypress.Commands.add('loginFuncionario', (email, password) => {
    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type(email)
    
    cy.get('input[placeholder="Password"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type(password)
    
    cy.contains('Ingresar').should('be.visible')
    cy.intercept('POST', `${environment.modeladorURL}api/v1/auth/sign_in`).as('login')
    cy.contains('Ingresar').click()
    cy.wait('@login').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
    })
    cy.log('Usuario loggeado ' + email)
    cy.wait(1000)
})

