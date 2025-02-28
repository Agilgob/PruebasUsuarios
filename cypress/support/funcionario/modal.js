Cypress.Commands.add('getModal', (title) => {
    cy.get('.modal-dialog .modal-content').filter(`:contains("${title}")`).first().as('modal');
    return cy.get('@modal');
  })