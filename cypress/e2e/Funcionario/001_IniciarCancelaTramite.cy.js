const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');

describe('Inicia el tramite luego lo cancela', () => {
    
    beforeEach(() => {
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password, environment);
    });

    describe('Iniciar y cancelar trámites', () => {

        it('El contador de tramites no deberia cambiar si se calcela el tramite iniciado', () => {
            cy.visit(environment.funcionarioURL);
            cy.get('.one_column .fa-align-justify').click();
            cy.get('[title="Sección de trámites"]').click();
            cy.get('.principal-nav > .container').as('barraMenuTramites');
            
            cy.get('@barraMenuTramites')
                .contains('Trámites iniciados')
                .invoke('text')
                .then((tramitesIniciados) => {
                    tramitesIniciados = tramitesIniciados.trim();
    
                    cy.get('@barraMenuTramites').contains('Tramites Disponibles').click();
                    cy.get('.procedure-card')
                        .contains('Firmado Electrónico de Documentos')
                        .parents('.procedure-card')
                        .as('targetCard');
    
                    cy.get('@targetCard').contains('Ir al trámite').click();
                    cy.contains('Cancelar', {timeout:10000}).click();
                    cy.screenshot('CANCELAR_TRAMITE');
                    cy.get('@barraMenuTramites', {timeout:10000})
                        .contains('Trámites iniciados')
                        .invoke('text')
                        .should('eq', tramitesIniciados);
                    cy.screenshot('CANCELAR_TRAMITE');

                });
        });
    });

   
});
