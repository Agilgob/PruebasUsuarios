import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Ingreso de acuerdos del funcionario', () => {

    let testData, tramite = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    
    before(() => {
        
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
          testData = data;
          tramite = testData.tramite;
        })

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
          
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });

    it('Se ingresa un documento de tipo acuerdo al expediente', () => {
        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.getActionButton('Agregar documento').should('be.visible').click(); 

        cy.intercept('GET', '**/api/v1/document_expedients/promotions_by_expedient_number/*').as('getPromotions');
        cy.llenarSelectModal('Tipo de documento', 'Acuerdo')
        cy.wait('@getPromotions').then((interception) => {
            console.log(interception.response.body.data);
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body.data.promotions).to.has.length.greaterThan(0)
        })

        cy.contains('button', 'Agregar Firma').should('be.enabled').click();
        // Modal Firma Electronica
        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Firma Electronica")').as('modalFirmaElectronica');
        cy.get('@modalFirmaElectronica').find('input[type=file]')
            .selectFile(funcionario.archivoFirel, { force: true });
        cy.get('@modalFirmaElectronica').find('#formGroupPasswordFiel').type(funcionario.passwordFirel);
        cy.get('@modalFirmaElectronica').find('button').contains('Agregar').click();


        // Multifirma
        cy.get('label[for="isMultipleSignatureToggleButton"] div').click(); 
        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Atención")')
            .find('button').contains('Continuar').click();

        // De vuelta al modal de Nuevo Documento
        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Nuevo documento")').as('modalNuevoDocumento');
        cy.llenarSelectModal('Rubro', 'ADMITE EXCEPCIÓN') // RUBRO
        cy.get('textarea[aria-label="Comentarios"]').type('Cypress test automatizado, se admite excepcion, ingreso de acuerdo') // COMENTARIOS
        
        // DESEA PUBLICAR EN EL BOLETIN
        cy.get('.form-group').filter(':contains("¿Desea publicar en el boletín?")').first().as('publicarBoletin');
        cy.get('@publicarBoletin').find('#accept-add-bulletin').click(); 

        // DOCUMENTO
        cy.contains('div', 'Selecciona un documento').find('input[type=file]')
            .selectFile(funcionario.archivoAcuerdos, { force: true }); 
        cy.get('.file-upload-wrapper')
            .scrollIntoView()
            .should('be.visible');

        // EXTRACTO PARA BOLETIN
        cy.contains('label', 'Extracto para boletín').siblings('textarea').scrollIntoView().should('be.visible')
            .type('Prueba automatizada publicacion en el boletin ' + new Date().toISOString())

        // RESPUETA A PROMOCIONES
        cy.get('.form-group').filter(':contains("Respuesta a promociones:")').as('respuestaPromociones'); 
        cy.get('@respuestaPromociones').find('.select__value-container--is-multi .select__multi-value').as('promociones');
        
        cy.get('@promociones').then(($promociones) => {
            cy.log("Cantidad de promociones: " + $promociones.length)
            expect($promociones).to.have.length.greaterThan(0)
        })

        cy.screenshot('Ingreso de acuerdo al expediente')
        cy.intercept('POST', '**/api/v1/document_expedients/upload').as('postUploadDocumento');

        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Nuevo documento")')
            .contains('button', 'Firmar').click(); 

        cy.wait('@postUploadDocumento').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            cy.log(`RESPONSE UPLOAD ACUERDO: ${JSON.stringify(interception.response)}`);
           
        })

        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Gestionar usuarios con acceso al documento")')
            .as('modalGestionAccesos');
        cy.get('@modalGestionAccesos').should('be.visible');

        cy.get('.list-group.list-group-flush').as('tablaPermisos');
        cy.get('@tablaPermisos').should('be.visible');
        cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
            .then((checkbox) => {
                if (!checkbox.is(':checked')) {
                    cy.get('@tablaPermisos').find('.custom-control.custom-switch').click();
                }
            })

        cy.get('@modalGestionAccesos').find('button').contains('Guardar').click();

        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Atencion!")')
            .as('modalAtencion')
        cy.get('@modalAtencion').find('button').contains('Aceptar').click();
        cy.wait(2000)
        
    })

})


// TODO Revisar ya que tira codigo 422 en lugar de 200