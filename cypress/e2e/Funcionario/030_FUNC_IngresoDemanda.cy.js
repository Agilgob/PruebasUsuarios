import { loadTestData, saveTestData } from '../../support/loadTestData';
import '../../support/funcionario/misExpedientes/page';
import { agregarExpedienteBtn } from '../../support/funcionario/misExpedientes/page';

describe('Agregar plantilla de sentencias', () => {


    let testData, tramite = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    
    before(() => {
    
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
          
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    it('Carga los datos del expediente', () => {
        cy.visit(environment.funcionarioURL);

        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Mis expedientes').click();

        agregarExpedienteBtn().click();


    })


    
})