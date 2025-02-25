
// Selecciona los valores de un campo casi tipo select en un formulario
// de demanda inicial del ciudadano
// campo : etiqueta del select
// valorSeleccion : valor a seleccionar de la lista desplegable
Cypress.Commands.add('llenarSelect', (campo, valorSeleccion) => {
    cy.get('.col-md-12 .row').filter(`:contains("${campo}")`).first().as('currentRow');
    cy.get('@currentRow').click().find('[class$="-menu"]').contains(valorSeleccion).click();
    cy.get('@currentRow').find('[class$=singleValue]').should('have.text', valorSeleccion);
});

Cypress.Commands.add('llenarSelectModal', (campo, valorSeleccion) => {
    cy.get('form .form-group').filter(`:contains("${campo}")`).first().as('currentRow');
    cy.get('@currentRow').click().find('[class$="-menu"]').contains(valorSeleccion).click();
    cy.get('@currentRow').find('[class$=singleValue]').should('have.text', valorSeleccion);
});



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

  
  



