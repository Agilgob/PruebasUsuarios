import { loadTestData } from "../../support/loadTestData"
import { accedeAlExpediente } from "../../support/ciudadano/expedientes";



describe('Valida que los documentos en el expediente NO esten accesibles antes de tener un acuerdo', () => {

    before(() => { 
        if(!Cypress.env('jsonFile')) {
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


    it('El ciudadano NO puede ver los documentos', () => {
        
        accedeAlExpediente(testData.expediente.expedient_number);
        cy.get('section.procedures-table-container').as('procedures');
        cy.get('@procedures').should('exist')
            .and('not.be.visible')
            .and('be.hidden')
        // cy.get('@procedures').contains('a', 'Documentos').click();
    });

})