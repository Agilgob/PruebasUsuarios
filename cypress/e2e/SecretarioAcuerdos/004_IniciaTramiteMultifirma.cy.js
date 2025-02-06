describe('Gestión de trámites', () => {
    let testData;
    let funcionario;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // funcionario almacena los datos de cualquier funcionario en el archivo de datos
        cy.fixture('localhost').then((data) => {
            testData = data;
            funcionario = testData.secretarioAcuerdos;
        });
    });

    beforeEach(() => {
        cy.visit(testData.url.funcionario);
        cy.loginFuncionario(funcionario.email, funcionario.password);
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
            
             // TO DO  modificar el codigo desde aqui para agregar multifirma
            // Agrega la firma de tipo Firel
            cy.get('button').contains('Agregar Firma').click();
            cy.cargarArchivoFirel(funcionario.archivoFirel, funcionario.passwordFirel);

            // Agregar el documento
            cy.cargarDocumento('Agregar Archivo', testData.documentoPDF);
            cy.log('Archivo PDF agregado correctamente');

            // Firmar
            cy.get('button').contains('Firmar').should('exist').click();
            cy.get('button').contains('Siguiente').click();

            // Descarga el documento cargado
            cy.get('.file-upload-wrapper.d-block > .d-block').should('not.be.hidden').click()
            cy.wait(4000)
            cy.readFile('cypress/downloads/deleteme.pdf', 'binary').should((buffer) => {
                expect(buffer.length).to.be.greaterThan(0);
            });
            cy.get('button').contains('Siguiente').click();
            cy.get('button').contains('Confirmar').click();

        });
    });

});

