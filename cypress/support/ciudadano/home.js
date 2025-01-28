const navigationBar = (element) => {
    return cy.get('.principal-nav.container-fluid .container')
        .contains('a', element)
} 

Cypress.Commands.add('getNavigationBar', navigationBar);