import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Inicia el tramite luego lo cancela', () => {
    
    before(() => { 
        loadTestData();
    });


    beforeEach(() => {
        cy.session('sesionFuncionario', () => {
            
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true // Ensures session is persisted across test files
        });
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
