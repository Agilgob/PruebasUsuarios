import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Funcionario : Modificar Expediente ', () => {

    const environment = Cypress.env('environment');
    const funcionario = Cypress.env('funcionario');

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
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });
    
    it('Barra de busqueda admite caracteres especiales' , () => {
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Modificar expedientes').should('be.visible').click()

        const caracteres = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', '/']

        cy.get('section.searcherContainer').find('input').as('barraBusqueda');
        caracteres.forEach(caracter => {
            cy.get('@barraBusqueda').type(caracter, {delay:0});
            cy.get('@barraBusqueda', {timeout:1000}).should('have.value', caracter);
            cy.get('@barraBusqueda').clear();
        })
    })
       
    
});
