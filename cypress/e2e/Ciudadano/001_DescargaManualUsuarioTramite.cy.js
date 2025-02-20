import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Inicia Tramite desde el portal de ciudadano', () => {


    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.visit(environment.ciudadanoURL);
        cy.loginCiudadano(ciudadano.email, ciudadano.password);
    });


    context("Descarga el manual de usuario del tramite", () => {
        it('Inicia un trámite y concluye la creacion', () => {
            // Ir a tramites disponibles
            cy.get('.principal-nav  ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Tramites disponibles').click();
    
            // Verifica que existan trámites disponibles
            cy.get('.procedure-card').should('have.length.greaterThan', 0);
    
            // Buscar un trámite
            cy.get('#searcher').type(ciudadano.tramite); // FIXME
            cy.get('i.ti-search')
                .parent()
                .should('be.visible')
                .and('be.enabled')
                .click();
    
            // Filtrar el trámite y hacer clic en el botón
            cy.get('.procedure-card').filter(":contains('" + ciudadano.tramite + "')").first().as('tramite'); // FIXME
            cy.get('@tramite').find('.ti-agenda').click();
            cy.get(".notification-message").should('not.exist'); 
           
            // TO DO - Corroborar haciendo la intersection 


        });
    });
})
