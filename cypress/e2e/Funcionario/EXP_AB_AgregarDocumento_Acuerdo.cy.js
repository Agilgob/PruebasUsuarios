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
            cy.wait(2000);
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
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

        const multifirma = Cypress.env('acuerdosMultifirma') ?? false;
        if(!multifirma) {
            // Deshabilita la multifirma
            cy.get('label[for="isMultipleSignatureToggleButton"] div').click(); 
            cy.get('div.modal-dialog > div.modal-content').filter(':contains("Atención")')
            .find('button').contains('Continuar').click();
        }

        // De vuelta al modal de Nuevo Documento
        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Nuevo documento")').as('modalNuevoDocumento');
        cy.llenarSelectModal('Rubro', 'ADMITE EXCEPCIÓN')
        cy.get('textarea[aria-label="Comentarios"]').type('Cypress test automatizado, se admite excepcion, ingreso de acuerdo')
        
        // Selecciona un archivo para el documento

        cy.contains('div', 'Selecciona un documento').find('input[type=file]')
            .selectFile(funcionario.archivoAcuerdos, { force: true });
        cy.get('.file-upload-wrapper').should('be.visible')


        // Verifica que haya promociones seleccionadas
        cy.get('.form-group').filter(':contains("Respuesta a promociones:")').as('respuestaPromociones');
        cy.get('@respuestaPromociones').find('.select__value-container--is-multi .select__multi-value').as('promociones');
        
        cy.get('@promociones').then(($promociones) => {
            cy.log("Cantidad de promociones: " + $promociones.length)
            expect($promociones).to.have.length.greaterThan(0)
        })

        cy.screenshot('Ingreso de acuerdo al expediente')
        
        // FIRMAR DOCUMENTO 
        const firmar = () => { 
            cy.get('div.modal-dialog > div.modal-content')
                .filter(':contains("Nuevo documento")')
                .contains('button', 'Firmar').click(); 
        }
        if (Cypress.env('acuerdosMultifirma')) {
            firmarMultifirma(firmar);
        }else{
            firmaSimple(firmar);
        }
        
        // Gestiona los accesos al documento
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

        // Guarda los cambios de acceso
        cy.get('@modalGestionAccesos').find('button').contains('Guardar').click();

        // Acepta la alerta de atención
        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Atencion!")')
            .as('modalAtencion')
        cy.get('@modalAtencion').find('button').contains('Aceptar').click();
        cy.wait(2000)
        
    })

})

const firmaSimple = ( firmar ) => {
    cy.log('FIRMA SIMPLE')

    cy.intercept('POST', '**/api/v1/document_expedients/upload').as('postUploadDocumento');
    firmar();
    cy.wait('@postUploadDocumento').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.log(`RESPONSE UPLOAD ACUERDO: ${JSON.stringify(interception.response)}`);
    })

}

const firmarMultifirma = ( firmar ) => {
    cy.log('FIRMA MULTIFIRMA')
    
    cy.intercept('POST', '**/api/v1/signature_documents/multisign').as('postMultifirma');
    cy.intercept('POST', '**/api/v1/signature_documents/multiple_signers/**').as('postmultiSigners');
    firmar();
    cy.wait(['@postMultifirma', '@postmultiSigners']).then((interceptions) => {
        const multisign = interceptions[0]
        const multiSigners = interceptions[1]

        expect(multisign.response.statusCode).to.eq(200);
        expect(multisign.response.body.data).to.have.property('signatureDocument')
        cy.log('MULTIFIRMA RESPONSE: ' + JSON.stringify(multisign.response.body.data.signatureDocument))

        expect(multiSigners.response.statusCode).to.eq(200);
        expect(multiSigners.response.body.data).to.have.property('signature_document_id')
        cy.log('MULTISIGNERS RESPONSE: ' + JSON.stringify(multiSigners.response.body.data))

    })
}

