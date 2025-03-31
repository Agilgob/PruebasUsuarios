import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Permite acceder al panel de vencimientos', () => {


    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
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
    
    it('Permite acceder al panel de vencimiento ' , () => {

        const validate = function(document){
            cy.wrap(document).contains('h4', 'con término de vencimiento').should('be.visible');
            cy.wrap(document).contains('h4', 'Expedientes').should('be.visible');
            cy.wrap(document).contains('th', 'Tiempo de recepción del expedientes').closest('table').as('tablaExpedientes')
            cy.get('@tablaExpedientes').find('tr').its('length').should('be.at.least', 1);
        }

        cy.visit(environment.funcionarioURL);
        cy.wait(2000);
        cy.document().then((doc) => {
            if(doc.URL.includes('expiration_panel')) {
                validate(doc)

            }else{
                cy.hamburguer().click();
                cy.sidebar('Panel de control').should('be.visible').click()
                cy.contains('li', 'Vencimiento').should('be.visible').as('panelVencimiento');
                cy.get('@panelVencimiento').parents('a').click();

                validate(doc)
            }
        })
             
    })
});
