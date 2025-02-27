import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Funcionario : Descargar expediente', () => {


    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
    });


    beforeEach(() => {
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password);
    });

    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Es posible descargar el expediente', () => {
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        
        cy.intercept('POST', `https://sandbox.nilo.cjj.gob.mx/api/v1/download_zip/${tramite.url.split('/').pop()}`).as('descargarExpediente');
        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        cy.get('@accionesExpediente').should('be.visible').and('have.descendants', 'button');
        cy.get('@accionesExpediente').get('button').filter(':contains("Descarga expediente")').first().click();
        cy.wait('@descargarExpediente').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.statusMessage).to.eq('OK');
            cy.log("RESPUESTA A download_zip" + JSON.stringify(interception.response));
        })
        cy.wait(1000) // Para que se registre mejor en el video

        	
    })
});
