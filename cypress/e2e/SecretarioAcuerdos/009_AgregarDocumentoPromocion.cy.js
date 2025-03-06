import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('El expediente permite agregar documento Promocion', () => {


    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
    });


    beforeEach(() => {
        cy.on("uncaught:exception", (err, runnable) => {
            cy.log(err.message);
            return false;
        })
        cy.clearCookies();
        cy.clearLocalStorage();
    
        cy.session('sesionFuncionario', () => {
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.contains('h3', 'Tablero de control', {timeout: 10000}).should('be.visible');
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
       

    it('El expediente permite agregar documento Promocion', () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        cy.get('@accionesExpediente').get('button').filter(':contains("Agregar documento")').first().click();
        cy.get('.modal-dialog', {'timeout':2000}).filter(':contains("Nuevo documento")').first().as('modalAgregarDocumento');
        cy.get('@modalAgregarDocumento').should('be.visible');
        cy.get('@modalAgregarDocumento').find('.select-body-modal__control').click()
        cy.get('@modalAgregarDocumento').find('.select-body-modal__menu').contains('Promoción').click()

            // Agregar firma
            cy.get('@modalAgregarDocumento').contains('button', 'Agregar Firma').click();

            // Agregar archivo .pfx en modal Firma Electronica
            cy.get('div .modal-dialog').filter(':contains("Firma Electronica")').first().as('modalFirmaElectronica');
            cy.get('@modalFirmaElectronica').should('be.visible');
            cy.get('@modalFirmaElectronica').contains('button', 'Agregar Archivo')
                .siblings('input').selectFile( funcionario.archivoFirel , { force: true });
            cy.get('@modalFirmaElectronica').get('input[placeholder="Password"]').type(funcionario.passwordFirel);
            cy.get('@modalFirmaElectronica').contains('button', 'Agregar').click(); 
            // cy.get('@modalFirmaElectronica').contains('button', 'Cancelar').click();

        cy.get('@modalAgregarDocumento').get('input[placeholder="Agrega una etiqueta para identificar este documento"]')
            .type("PROMOCION-CY"); // REVIEW
        cy.get('@modalAgregarDocumento').get('textarea[aria-label="Comentarios"]')
            .type(`PRUEBA AUTOMATIZADA ${new Date().toLocaleString()}`); // REVIEW
        
        cy.get('#fileInputNewDocuemnt') // Asegura que el selector sea correcto
            .should('have.attr', 'type', 'file')
            .and('have.attr', 'accept', '.pdf, .doc, .docx')
            .and('not.be.visible')
            .and('be.enabled')
            .selectFile(environment.documentoPDF, { force: true });
        cy.wait(2000)

        cy.get('@modalAgregarDocumento').find('[aria-label="Nombre del promovente"]')
            .type(funcionario.nombre);
        
        cy.get('@modalAgregarDocumento')
            .get('.form-group')
            .contains('label', '¿Quieres agregar anexos?')
            .parent()
            .find(`.form-check-input#no`) // REVIEW
            .click()
        cy.wait(10000)
        // cy.get('@modalAgregarDocumento').contains('button', 'Cancelar').click();

        cy.intercept('POST', 'https://sandbox.nilo.cjj.gob.mx/api/v1/document_expedients/upload').as('postUploadDocumento');
        cy.get('@modalAgregarDocumento').contains('button', 'Firmar').click(); 
        cy.wait('@postUploadDocumento').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            cy.log(`RESPONSE UPLOAD PROMOCION: ${JSON.stringify(interception.response)}`);
           
        })

        cy.get('.users-and-permissions-list-modal').as('modalPermisosUsuarios');
        cy.get('@modalPermisosUsuarios').should('be.visible');
        cy.get('@modalPermisosUsuarios').contains('button', 'Guardar').click();
        cy.get('@modalPermisosUsuarios').contains('button', 'Aceptar').click();

    });

});
