import { loadTestData } from "../../support/loadTestData"
import { accedeAlExpediente } from "../../support/ciudadano/expedientes";



describe('Valida que los documentos en el expediente NO esten accesibles antes de tener un acuerdo', () => {

    const environment = Cypress.env('environment');
    let testData, ciudadano, tramite = null;

    before(() => { 
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
            testData = data;
            tramite = testData.tramite;
            ciudadano = testData.ciudadano;
        })
  
    });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
        });
    });


    it('El ciudadano SI puede ver los documentos', () => {
        
        accedeAlExpediente(testData.expedient.expedient_number, environment);

        cy.get('section.procedures-table-container').as('procedures');
        cy.get('@procedures').should('exist')
            .and('be.visible')
            .and('not.be.hidden')
        
        cy.get('@procedures').find('table tbody').as('table');
        cy.get('@table').find('tr').should('have.length.at.least', 2);

        cy.intercept('GET', '**/api/v1/document_expedients/download_watermark/*/*').as('downloadView');

        // Itera sobre los elementos de la tabbla que contienen los documentos
        cy.get('@table').find('tr').each(($row, index, $rows) => {
            cy.wrap($row).should('be.visible')
                .and('not.be.hidden')
            cy.wrap($row).find('button[title="Descargar / Visualizar"]').click();
            cy.wait('@downloadView').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            })

            cy.get('div.modal-dialog.modal-lg .modal-content').as('modal');
            cy.get('@modal').should('be.visible')
                .and('not.be.hidden')
            cy.wait(1000)
            cy.wrap($row).find('td:nth-child(2)').invoke('text').then((text) => {
                cy.screenshot(`documento_${text}`);
            })

            cy.get('@modal').contains('button', 'Cerrar').click();

        })

        cy.screenshot('DOCUMENTOS_ACCESIBLES');
    })

})

