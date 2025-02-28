import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Descarga el manual de usuario de los tramites en la primer pantalla', () => {

    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
        });
    });

    it('Los datos del demandado se ocultan despues de ocultar al demandado', () => {
        expect(tramite.nombre).to.be.equal('Juzgados Civiles, Familiares y Mercantiles en línea');

        cy.visit(environment.ciudadanoURL);
        
        // Ir a tramites disponibles
        cy.get('.principal-nav  ul').as('menuPrincipal');
        cy.get('@menuPrincipal').contains('Trámites disponibles').click();

        // Verifica que existan trámites disponibles
        cy.get('.procedure-card').should('have.length.greaterThan', 0);

        // Buscar un trámite
        cy.get('#searcher').type(tramite.nombre);
        cy.get('i.ti-search')
            .parent()
            .should('be.visible')
            .and('be.enabled')
            .click();

        cy.get('.procedure-card').filter(`:contains("${tramite.nombre}")`).first().as('tramite');
        cy.get('@tramite').contains('button', 'Ir al trámite').click();


        // Iniciar tramite
        cy.contains('button', 'Iniciar trámite')
            .should('be.visible')
            .and('be.enabled')
            .click();
        

    })
})