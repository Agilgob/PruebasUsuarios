import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Habilita la vista de la demanda al ciudadano', () => {


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
    

  
    it('Habilita la vista de todos los documentos al ciudadano', () => {

        let documento;
        cy.visit(tramite.url, {failOnStatusCode: false});

        cy.intercept('GET', `${environment.modeladorURL}api/v1/document_expedients/documents/*/10?page=1`).as('getDocumentos');


        cy.intercept('POST', `${environment.modeladorURL}api/v1/docuemnts_expedient/document_expedient_users_permissions/*`)
                .as('postPermisosExpediente');

        cy.wait('@getDocumentos').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.have.property('data');
            // expect(interception.response.body.data).to.have.length.greaterThan(0);
            expect(interception.response.body.data).to.have.property('documents');

            const documentos = interception.response.body.data.documents;
            expect(documentos).to.have.length.greaterThan(0);
            cy.log(documentos)
            documento = documentos[0];

        }).then(() => {
            cy.get('.document-expedient-table.procedures-table-container').as('tablaDocumentos');
            cy.get('@tablaDocumentos').find('tbody tr td.fixed-cell').as('tdControlDocumentos');
            cy.get('@tdControlDocumentos').each((element) => {
                cy.wrap(element).find('[title="Gestionar permisos"]').should('have.descendants', 'i').click()
                cy.get('.list-group.list-group-flush').as('tablaPermisos');
                cy.get('@tablaPermisos').should('be.visible');
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
            })          
        })
    })
});
