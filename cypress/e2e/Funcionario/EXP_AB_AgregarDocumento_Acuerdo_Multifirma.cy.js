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

        firmarMultifirma(firmar);
        
        cy.getModal('Expedientes').as('modalExpedientes');
        cy.get('@modalExpedientes').should('be.visible');
        cy.get('@modalExpedientes').getBody().contains('Turnado interno')
            .should('be.visible').click();
        
        const labels = ['Número de expediente','Tipo de Juicio:', 'Vía:', 'Materia:' ]; 
        labels.forEach((label) => {
            validateField(label);
        })
    
        cy.seleccionaFuncionarioTurnar(); // Selecciona el primer funcionario de la lista
        cy.llenaCampoObservaciones()
        cy.screenshot('Turnado de expediente interno')

        cy.transferirExpediente('Interno').then(interception => {
            cy.writeFile(`tmp/tunado-acuerdos-multifirma.json`, interception);
            testData.expedienteTurnado = interception.response.body.data.governmentBook;
            testData.expedienteTurnado.receiver = interception.request.body.receiver;
            cy.writeFile('tmp/testData.json', testData, { log: false });

            // cy.intercambiaFuncionarioJsonFile(interception)
        }) // support/funcionario/expediente.js

    })

})

const validateField = (label) => {
    cy.contains('b', label, {log: false})
      .closest('div', {log: false})
      .find('[class!="singleValue"]',  {log: false})
      .as('field');
  
    cy.get('@field', {log: false})
      .invoke('text')
      .then((text) => {
        const trimmed = text.trim();
        if (trimmed.length === 0) {
          throw new Error(`El campo "${label}" se encuentra vacío.`);
        } else {
          cy.log(`Campo "${label}" contiene: ${trimmed}`);
        }
      });
  };

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

