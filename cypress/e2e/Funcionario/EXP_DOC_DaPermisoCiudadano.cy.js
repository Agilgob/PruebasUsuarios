import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Habilita la vista de la demanda al ciudadano', () => {

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
    

  
    it('Habilita la vista de todos los documentos al ciudadano', () => {


        cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('getDocumentos');
        cy.visit(tramite.url, {failOnStatusCode: false});


        cy.intercept('POST', `**/api/v1/docuemnts_expedient/document_expedient_users_permissions/*`)
                .as('postPermisosExpediente');

        cy.wait('@getDocumentos').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.have.property('data');
            // expect(interception.response.body.data).to.have.length.greaterThan(0);
            expect(interception.response.body.data).to.have.property('documents');

            const documentos = interception.response.body.data.documents;
            expect(documentos).to.have.length.greaterThan(0);
            cy.log(documentos)
        })  

        cy.get('.document-expedient-table.procedures-table-container').as('tablaDocumentos');
        cy.get('@tablaDocumentos').find('tbody tr td.fixed-cell').as('tdControlDocumentos');
        cy.get('@tdControlDocumentos').each((element) => {
            cy.wrap(element).find('[title="Gestionar permisos"]').should('have.descendants', 'i').click()
            cy.get('.list-group.list-group-flush').as('tablaPermisos');
            cy.get('@tablaPermisos').should('be.visible');
            cy.get('@tablaPermisos').find('.custom-control.custom-switch > input[type="checkbox"]')
                .then((checkbox) => {
                    if (checkbox.is(':checked')) {
                        cy.log('El permiso ya está habilitado para ' + element.text());
                        cy.contains('button', 'Cerrar').click()
                        cy.contains('button', 'Aceptar').click()

                    } else {
                        cy.get('@tablaPermisos').find('.custom-control.custom-switch').click();
                        cy.contains('button', 'Guardar').click()
                        cy.contains('button', 'Aceptar').click()
                        cy.wait('@postPermisosExpediente').then((interception) => {
                            //  Verificar que la petición se hizo correctamente
                            expect(interception.response.statusCode).to.eq(200); 

                            //  Revisar el request enviado
                            cy.log(`Méthod: ${interception.request.method}`);
                            cy.log(`URL: ${interception.request.url}`);
                            cy.log(`Headers: ${JSON.stringify(interception.request.headers, null, 2)}`);
                            cy.log(`Body: ${JSON.stringify(interception.request.body, null, 2)}`);

                            expect(interception.request.body).to.have.property('users');
                            expect(interception.request.body.users).to.have.length.greaterThan(0);
                            expect(interception.request.body.users[0]).to.have.property('isPermissionEnabled');
                            expect(interception.request.body.users[0].isPermissionEnabled).to.be.true;
                        });
                    }
                    cy.screenshot('Permiso del documento')

                })            
        })
    })
});
