import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}




describe('Permite acceder al panel de firmas pendientes ', () => {

    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    let hayFirmasPendientes = false;
    let documents = [];

    // before(() => { 
    //     loadTestData();
    //     if(!testData.expedientFound) { // si es undefined o false
    //         testData.expedientFound = false;
    //     }
    // });

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

        capturaFirmasPendientes(environment);

    });
    
    it('Permite descargar documento' , () => {
        validaFirmasPendientes(hayFirmasPendientes)
        cy.get('section.procedures-table-container', {log:false}).as('sectionProcedures')
        cy.get('@sectionProcedures').find('tbody tr').first().as('firstDocument')
        
        cy.intercept('GET', '**/api/v1/signature_documents/download_watermark/**').as('downloadDocument');
        cy.get('@firstDocument').find('button[title="Descargar documento"]').click();
        cy.wait('@downloadDocument').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.headers['content-type']).to.eq('application/pdf')
        })
    })

    it('Permite ver el documento' , () => {
        validaFirmasPendientes(hayFirmasPendientes)
        cy.get('section.procedures-table-container', {log:false}).as('sectionProcedures')
        cy.get('@sectionProcedures').find('tbody tr').first().as('firstDocument')

        cy.intercept('GET', '**/api/v1/signature_documents/download_watermark/**').as('downloadDocument');
        cy.get('@firstDocument').find('button[title="Visualizar documento"]').click();
        cy.wait('@downloadDocument').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.headers['content-type']).to.eq('application/pdf')
        })
        cy.getModal('Documento a firmar').should('be.visible')
        cy.screenshot('Ver documento por firmar')
        cy.getModal('Documento a firmar').getFooter().find('button').contains('Cerrar').click();
    })

    it('Permite agregar comentarios al documento', () => {
        validaFirmasPendientes(hayFirmasPendientes)
        cy.get('section.procedures-table-container', {log:false}).as('sectionProcedures')
        cy.get('@sectionProcedures').find('tbody tr').first().as('firstDocument')
        cy.get('@firstDocument').find('button[title="Comentarios"]').click();
        cy.getModal('Comentarios').should('be.visible')
        cy.getModal('Comentarios').getFooter().find('textarea[name="comment"]')
            .type('Comentario en prueba automatizada cypres ' + new Date().toISOString()); 
        cy.screenshot('Comentario en documento por firmar')
        cy.getModal('Comentarios').getFooter().find('button[title="Comentar"]').click()
    })

    it('Permite firmar el documento', () => {
        validaFirmasPendientes(hayFirmasPendientes)
        cy.get('section.procedures-table-container', {log:false}).as('sectionProcedures')
        cy.get('@sectionProcedures').find('tbody tr').first().as('firstDocument')

        cy.intercept('GET', '**/api/v1/signature_documents/signers/*').as('getSigners');
        cy.get('@firstDocument').find('button[title="Firmar documento"]').click();
        cy.wait('@getSigners').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body.data).to.have.property('length')
            if(interception.response.body.data.length > 0) {
                expect(interception.response.body.data[0]).to.have.property('id')
                expect(interception.response.body.data[0]).to.have.property('signature_document_id')
                expect(interception.response.body.data[0]).to.have.property('user_id')
            }
        })

        cy.getModal('Firmar Documento').should('be.visible')
        
        let numFirmas = 0;
        cy.getModal('Firmar Documento').getBody().find('tbody tr').then((rows) => {
            numFirmas = rows.length;
            cy.log('Número de firmas:', numFirmas);
        });

        cy.getModal('Firmar Documento').getBody().find('button').contains('Agregar Firma').click()

        cy.getModal('Firma Electronica').should('be.visible')
        cy.getModal('Firma Electronica').getBody().find('input[type="file"]').selectFile(funcionario.archivoFirel, { force: true });
        cy.getModal('Firma Electronica').getBody().find('input#formGroupPasswordFiel').type(funcionario.passwordFirel);
        cy.getModal('Firma Electronica').getFooter().find('button').contains('Agregar').click()

        cy.getModal('Firmar Documento').getBody().find('tbody tr').then((rows) => {
            expect(rows.length).to.be.greaterThan(numFirmas);
        });

        cy.getModal('Firmar Documento').getFooter().find('button').contains('Finalizar multifirma').click()

        cy.intercept('POST', '**/api/v1/signature_documents/signature_end/*').as('postSignatureEnd');
        cy.getModal('Alerta').getFooter().contains('button', 'Confirmar').click()
        cy.wait('@postSignatureEnd').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body.status).to.eq(true)
            expect(interception.response.body.code).to.eq(200)
        })


    })

    it('Permite eliminar el documento', () => {
        validaFirmasPendientes(hayFirmasPendientes)
        cy.get('section.procedures-table-container', {log:false}).as('sectionProcedures')
        cy.get('@sectionProcedures').find('tbody tr').first().as('firstDocument')
        cy.get('@firstDocument').find('button[title="Eliminar documento"]').click();
        cy.getModal('Eliminar documento').should('be.visible')

        cy.intercept('DELETE', '**/api/v1/signature_documents/delete/*').as('deleteDocument');
        cy.getModal('Eliminar documento').getFooter().find('button').contains('Eliminar').click()
        cy.wait('@deleteDocument').then((interception) => {
            expect(interception.response.statusCode).to.eq(200)
            expect(interception.response.body.status).to.eq(true)
            expect(interception.response.body.code).to.eq(200)
            cy.writeFile('tmp/DocumentoPendienteFirmaEliminado.json', interception.response.body.data)
        })
    })


    function capturaFirmasPendientes(environment) {
        cy.visit(environment.funcionarioURL);
        cy.wait(2000);
        cy.hamburguer().click();
        cy.sidebar('Panel de control').should('be.visible').click();
    
        capturaDocumentosPendientes(() => {
            cy.contains('li', 'Pendiente de firma').should('be.visible').as('panelPendFirma');
            cy.get('@panelPendFirma').parents('a').click();
        }).then((signatureDocuments) => {
            documents = signatureDocuments;
            cy.log('Documentos pendientes de firma: ', documents.length);
        });
    
        cy.contains('li a', 'Pendiente de firma').scrollIntoView().should('be.visible').as('pendFirma');
        cy.get('@pendFirma').should('have.attr', 'class').and('include', 'active');
    
        cy.document().then((doc) => {
            cy.get('div.mt-2 h4.text-center').scrollIntoView().should('be.visible')
                .invoke('text').then((text) => {
                    if (text.includes('No se encontraron documentos')) {
                        throw Error("No se encontraron documentos pendientes de firma")
                    } else {
                        cy.get('section.procedures-table-container', { log: false }).as('sectionProcedures');
                        cy.get('@sectionProcedures').find('tbody tr').should('have.length', documents.length);
                        hayFirmasPendientes = true;
                    }
                });
    
        });
    }
    

});




const capturaDocumentosPendientes = (desencadenador) => {
    cy.intercept('GET', '**/api/v1/signature_documents/get_documents_pending_signature_by_user/**').as('getDocuments');
    desencadenador();
    return cy.wait('@getDocuments').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body.data).to.have.property('signatureDocuments')
        return interception.response.body.data.signatureDocuments;
    })
}


function validaFirmasPendientes(hayFirmasPendientes){

    if(!hayFirmasPendientes) {
        cy.screenshot(`${Cypress.currentTest.title }`);
        throw new Error(`Prueba: "${Cypress.currentTest.title } abortada por falta de documentos pendientes`);
    }
}

// TODO Revisar los resultados ya que al eliminar y firmar generar errores 
// FIXME