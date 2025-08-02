Cypress.Commands.add('hamburguer', () => {
    return cy.get('.navbar-brand .fa-align-justify');
    });




// Sidebar que despliega el hamburguer menu

Cypress.Commands.add('sidebar', (label) => {
    return cy.get('.sidebarActive').contains(label)
})

Cypress.Commands.add('sidebarExpedientes', (label) => {
    return cy.get('.itemsDropdownGovernmentBook').contains(label)
})

