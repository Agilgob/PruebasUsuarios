

import { loadTestData, saveTestData } from '../../support/loadTestData';
import { getAllPromotions } from '../../support/funcionario/promociones';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Permite acceder al panel de vencimientos', () => {

    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');

    // before(() => { 
    //     loadTestData();
    //     if(!testData.expedientFound) { // si es undefined o false
    //         testData.expedientFound = false;
    //     }
    // });

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

        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Expedientes').should('be.visible').click()
        
        getAllPromotions( () => { 
            cy.sidebarExpedientes('Promociones').should('be.visible').click()
        }).then((promociones) => {

            console.log( promociones)
            expect(promociones.length).to.be.greaterThan(0)
            
        })

        cy.get('tbody td button').first().click()
        cy.contains('p', '¿Desea marcar esta promoción como atendida?').parent().as('modal');

        cy.intercept('POST', '**/api/v1/document_expedients/active_promotions').as('postPromotion');
        cy.get('@modal').contains('button', 'Confirmar').click();
        
        cy.wait('@postPromotion').then((intercept) => {
            expect(intercept.response.statusCode).to.equal(200)
            expect(intercept.response.body.status).to.equal(true)
            expect(intercept.response.body.code).to.equal(200)
        })
    })
});
