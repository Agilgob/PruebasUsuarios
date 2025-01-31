describe('Iniciar Tramites', () => {
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

    it('Login a portal funcionarios', () => {
        cy.get('.one_column .fa-align-justify').click(); // Menú hamburguesa
        cy.get('[title="Sección de trámites"]').click(); // Sección trámites

        cy.get('.principal-nav > .container').as('barraMenuTramites');
        cy.get('@barraMenuTramites').contains('Tramites Disponibles').click(); // Tramites disponibles

        cy.get('.procedure-card')
            .contains('Firmado Electrónico de Documentos')
            .parents('.procedure-card')
            .as('targetCard')

        cy.get('@targetCard').contains('Ir al trámite').click();
        cy.contains('Cancelar').click();

        cy.get('@barraMenuTramites')
            .contains('Trámites iniciados')
            .children()
            .invoke('text')
            .should('eq', '0')
    });

    it('No debe haber registros en la tabla de tramites', () => {
        cy.get('.one_column .fa-align-justify').click(); // Menú hamburguesa
        cy.get('[title="Sección de trámites"]').click(); // Sección trámites
        cy.get('.principal-nav > .container').as('barraMenuTramites');
        cy.screenshot('Tramites iniciados deben ser 0');
        cy.get('@barraMenuTramites').contains('Trámites iniciados').click(); // Tramites iniciados
        // cy.get('.react-bootstrap-table .table-bordered thead tr').should() TODO revisar que no hay registros en la tabla

 
    }) 


});
