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

    describe('Iniciar y cancelar trámites', () => {
        it('Inicia un trámite que después cancela', () => {
            cy.get('.one_column .fa-align-justify').click();
            cy.get('[title="Sección de trámites"]').click();
            cy.get('.principal-nav > .container').as('barraMenuTramites');
    
            cy.get('@barraMenuTramites')
                .contains('Trámites iniciados')
                .invoke('text')
                .then((tramitesIniciados) => {
                    tramitesIniciados = tramitesIniciados.trim();
    
                    cy.get('@barraMenuTramites').contains('Trámites Disponibles').click();
                    cy.get('.procedure-card')
                        .contains('Firmado Electrónico de Documentos')
                        .parents('.procedure-card')
                        .as('targetCard');
    
                    cy.get('@targetCard').contains('Ir al trámite').click();
                    cy.contains('Cancelar').click();
    
                    cy.get('@barraMenuTramites')
                        .contains('Trámites iniciados')
                        .invoke('text')
                        .should('eq', tramitesIniciados);
                });
        });
    });

   
});
