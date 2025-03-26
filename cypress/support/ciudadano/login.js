Cypress.Commands.add('loginCiudadano', (email, password) => {
    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type(email)
  
    cy.get('input[placeholder="Contraseña"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type(password)
  
    cy.contains('Entrar').should('be.visible')
    cy.intercept('POST', `**/api/v1/auth/sign_in`).as('login')
    cy.contains('Entrar').click()
    cy.wait('@login').then((interception) => {
      expect(interception.response.statusCode).to.eq(200)
    })
    cy.wait(1000)
    
  })


Cypress.Commands.add('password', ()=> {})


cy.password().type('')