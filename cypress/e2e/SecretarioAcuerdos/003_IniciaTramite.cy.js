import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Es posible iniciar un tramite desde el funcionario', () => {

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

            cy.get('.principal-nav > .container', {log:false} ).as('barraMenuTramites');
            cy.get('@barraMenuTramites', {log:false}).contains('Tramites Disponibles', {log:false}).click();
            cy.get('.procedure-card', {log:false})
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

            // Firmar TO DO usar intercept
            cy.get('button').contains('Firmar').should('exist').click();
            cy.get('button').contains('Siguiente').click();

            // Descarga el documento cargado
            cy.get('.file-upload-wrapper.d-block img.d-block', {timeout:10000}).click()
            
            cy.screenshot()
          
            cy.intercept('POST', /\/api\/v1\/execute_stage$/).as('execute_stage');
            cy.get('button').contains('Siguiente').click(); 
            cy.wait('@execute_stage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
            })

            cy.intercept('POST', /\/api\/v1\/finalize_stage$/).as('finalize_stage');
            cy.get('button').contains('Confirmar').click();
            cy.wait('@finalize_stage').then((interception) => {
                expect(interception.response.statusCode).to.eq(200);
                expect(interception.response.body.data.error).to.eq(false);
            })
            cy.screenshot()

        });
    });

});

