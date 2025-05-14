import { loadTestData } from "../../support/loadTestData";


describe('Inicia el tramite luego lo cancela', () => {
    
    before(() => { 
        loadTestData();
    })

    beforeEach(() => {
        cy.session('sesionFuncionario', () => {
            
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.wait(2000);
            
        }, {
            validate() {
                cy.getAllLocalStorage().then((storage) => {

                    let expDate = storage['https://sandbox.funcionario.cjj.gob.mx']["tokenExpirationDateStored"]; 
                    let parsedExpDate = Date.parse(expDate) - 60000; // se restan 30s del prompt y 30 para la prueba
                    cy.log(parsedExpDate); 
                    expect(parsedExpDate).to.be.greaterThan(Date.now());

                })
                cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
            },
            cacheAcrossSpecs: true,
        });

    })

    it("prueba para inicion de sesion" , () => {
        cy.visit(environment.funcionarioURL);
    })


})