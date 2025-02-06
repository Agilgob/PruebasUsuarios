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


// Metodo para agregar el documento a un tramite
Cypress.Commands.add('cargarDocumento', (buttonText, filePath) => {
  cy.get('button')
    .contains(buttonText)
    .parent()
    .as('fileUploadContainer'); // Guardamos el contenedor en un alias para reutilizarlo

  cy.get('@fileUploadContainer')
    .find('input[type=file]')
    .should('exist')
    .selectFile(filePath, { force: true });
});



// Metodo para agregar un archivo Firel a un tramite
Cypress.Commands.add('cargarArchivoFirel', (filePath, password) => {
  cy.get('div.modal-content').within(() => {
    cy.get('[name="signaturetype"]').contains('Firel').click();
    cy.contains('Agregar Archivo').parent().find('input[type=file]').selectFile(filePath, { force: true });
    cy.get('[placeholder="Password"]').should('have.attr', 'type', 'password').type(password);
    cy.contains('button', 'Agregar').click();
  });
});