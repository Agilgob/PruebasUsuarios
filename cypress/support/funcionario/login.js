
Cypress.Commands.add('loginFuncionario', (email, password) => {
    cy.get('input[placeholder="Correo electrónico"]').as('email')
    cy.get('@email').should('be.visible')
    cy.get('@email').type(email)
    
    cy.get('input[placeholder="Password"]').as('password')
    cy.get('@password').should('be.visible')
    cy.get('@password').type(password)
    
    cy.contains('Ingresar').should('be.visible')
    cy.intercept('POST', `**/api/v1/auth/sign_in`).as('login')
    cy.contains('Ingresar').click()
    cy.wait('@login').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
    })
    cy.log('Usuario loggeado ' + email)

})


Cypress.Commands.add('iniciarSesionFuncionario', (email, password) => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.session('sesionFuncionario', () => {
        cy.visit(environment.funcionarioURL);
        cy.loginFuncionario(email, password);
        cy.contains('h3', 'Tablero de contro', {timeout: 10000}).should('be.visible');
        cy.getCookie('authentication_token_03').should('exist');
    }, {
        cacheAcrossSpecs: true
    });
});
