import { loadTestData } from "../../support/loadTestData";


describe('Prueba basica de login', () => {
    
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');

    beforeEach(() => {
        cy.session('sesionFuncionario', () => {
            
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.wait(2000);
            
        });

    })

    it("prueba para inicion de sesion" , () => {
        cy.visit(environment.funcionarioURL); // TODO Agregar validaciones de los endpoints que se consultan al iniciar sesión
        cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
    })


})