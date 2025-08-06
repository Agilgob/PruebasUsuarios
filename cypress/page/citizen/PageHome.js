const navigationBar = (element) => {
    return cy.get('.principal-nav.container-fluid .container')
        .contains('a', element)
} 

Cypress.Commands.add('getNavigationBar', navigationBar);


export class PageHome {
    constructor() {}

    getNavigationBar(){
        return cy.get('.principal-nav.container-fluid .container')
    }

    h2Title(){
        return cy.get('div h2');
    }

    // Methods to interact with page elements
    navigateToSection(section) {
        this.getNavigationBar()
            .contains('a', section)
            .click();
    }

}

