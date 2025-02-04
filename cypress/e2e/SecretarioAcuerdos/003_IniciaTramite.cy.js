describe('Gestión de trámites', () => {
    let testData;

    before(() => {
        cy.fixture('localhost').then((data) => {
            testData = data;
        });
    });

    beforeEach(() => {
        cy.visit(testData.url.funcionario);
        cy.loginFuncionario(testData.secretarioAcuerdos.email, testData.secretarioAcuerdos.password);
    });

    describe('Iniciar tramite', () => {
        it('Inicia un trámite y concluye la creacion', () => {
            cy.get('.one_column .fa-align-justify').click();
            cy.get('[title="Sección de trámites"]').click();
            cy.wait(2000);  

            cy.get('.principal-nav > .container').as('barraMenuTramites');
            cy.get('@barraMenuTramites').contains('Tramites Disponibles').click();
            cy.get('.procedure-card')
                .contains('Firmado Electrónico de Documentos')
                .parents('.procedure-card')
                .as('targetCard');

            cy.get('@targetCard').contains('Ir al trámite').click();
            

            // Agrega la firma de tipo Firel
            cy.get('button').contains('Agregar Firma').click();
            cy.get('div.modal-content').then(($modal) => {
                cy.wrap($modal)
                    .find('[name="signaturetype"]')
                    .contains('Firel')
                    .click();
            
                cy.wrap($modal)
                    .contains('Agregar Archivo')
                    .get('input[type=file]')
                    .eq(1)
                    .selectFile(testData.secretarioAcuerdos.archivoFirel, { force: true })
                    .click({ force: true });
            
                cy.wrap($modal)
                    .find('[placeholder="Password"]')
                    .should('have.attr', 'type', 'password')
                    .type(testData.secretarioAcuerdos.passwordFirel);
            
                cy.wrap($modal)
                    .find('button')
                    .contains('Agregar')
                    .click();
            });
            
            // Agregar el documento
            cy.get('button')
                .contains('Agregar Archivo')
                .parent()
                .as('fileUploadContainer'); // Guardamos el contenedor en un alias para reutilizarlo

            cy.get('@fileUploadContainer')
                .find('input[type=file]')
                .should('exist')
                .selectFile(testData.documentoPDF, { force: true });

            cy.log('Archivo PDF agregado correctamente');

            cy.get('button').contains('Firmar').should('exist').click();
            cy.get('button').contains('Siguiente').click();


            // Descarga el documento cargado
            cy.get('.file-upload-wrapper.d-block > .d-block').should('not.be.hidden').click()
            cy.wait(4000)
            //cy.readFile('cypress/downloads/deleteme.pdf').should('exist')// TO DO validar la existencia del archivo sin abrirlo
            //cy.task('deleteFile', 'cypress/downloads/deleteme.pdf'); TO DO crear metodo para eliminar archivo

            
            cy.get('button').contains('Siguiente').click();
            cy.get('button').contains('Confirmar').click();

        });
    });



   
});

