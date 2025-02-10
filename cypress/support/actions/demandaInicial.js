
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

  
  



