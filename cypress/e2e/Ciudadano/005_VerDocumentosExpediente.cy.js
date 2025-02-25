import { loadTestData } from "../../support/loadTestData"

describe('Valida que los documentos en el expediente se encuentren accesibles', () => {

    before(() => { 
        if(!Cypress.env('testData')) {
            throw new Error('Requiere cargar datos de prueba para ejecutar esta prueba');
        }
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


    it('El ciudadano puede ver los documentos de un expediente', () => {
        cy.visit(environment.ciudadanoURL);
        cy.get('.principal-nav  ul').as('menuPrincipal');
        cy.get('@menuPrincipal').contains('Mis expedientes').click();

        // Buscar el expediente
        cy.get('input#searcher').as('buscador');
        cy.get('@buscador').type(testData.expedient_number);
        cy.get('@buscador').siblings('button').click();
        
        //
        cy.contains('a', testData.expedient_number).click();
        
    });

})