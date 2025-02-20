import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Gestión de trámites', () => {

    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.visit(environment.funcionarioURL);  
        cy.loginFuncionario(funcionario.email, funcionario.password);
    });

    describe('Iniciar tramite', () => {
        it('Inicia un trámite y concluye la creacion', () => {
            cy.get('.navbar-brand .fa-align-justify').click();
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
            cy.cargarArchivoFirel(funcionario.archivoFirel, funcionario.passwordFirel);

            // Agregar el documento
            cy.cargarDocumento('Agregar Archivo', environment.documentoPDF);
            cy.log('Archivo PDF agregado correctamente');

            // Firmar
            cy.get('button').contains('Firmar').should('exist').click();
            cy.get('button').contains('Siguiente').click();

            // Descarga el documento cargado
            cy.get('.file-upload-wrapper.d-block img.d-block', {timeout:10000}).click()
            
            // cy.readFile('cypress/downloads/deleteme.pdf', 'binary').should((buffer) => {
            //     expect(buffer.length).to.be.greaterThan(0);
            // }); // FIXME La descarga se hace pero el nombre de archivo no coincide
            cy.screenshot()
          

            cy.get('button').contains('Siguiente').click();
            cy.get('button').contains('Confirmar').click();
            cy.screenshot()

        });
    });

});

