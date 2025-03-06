import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Ingreso de acuerdos del funcionario', () => {


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
        cy.llenarSelectModal('Rubro', 'ADMITE EXCEPCIÓN')
        cy.get('textarea[aria-label="Comentarios"]').type('Cypress test automatizado, se admite excepcion, ingreso de acuerdo')
        
        cy.contains('div', 'Selecciona un documento').find('input[type=file]')
            .selectFile(funcionario.archivoAcuerdos, { force: true });
        cy.get('.file-upload-wrapper').should('be.visible')


        cy.get('.form-group').filter(':contains("Respuesta a promociones:")').as('respuestaPromociones');
        cy.get('@respuestaPromociones').find('.select__value-container--is-multi .select__multi-value').as('promociones');
        cy.get('@promociones').should('have.length.greaterThan', 0)

        cy.screenshot('Ingreso de acuerdo al expediente')

        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Gestionar usuarios con acceso al documento")')
            .as('modalGestionAccesos');

        cy.get('@modalGestionAccesos').find('div [id^="custom-switch-"]').then(($checkbox) => {
            if (!$checkbox.is(':checked')) {
                cy.wrap($checkbox).click();
            }
        });

        cy.get('@modalGestionAccesos').find('button').contains('Guardar').click();

        cy.get('div.modal-dialog > div.modal-content').filter(':contains("Atencion!")')
            .as('modalAtencion')
        cy.get('@modalAtencion').find('button').contains('Aceptar').click();

        
    })

})

