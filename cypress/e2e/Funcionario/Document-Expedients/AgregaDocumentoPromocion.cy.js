
import { ModalPublishBulletin } from "../../../page/functionary/document-expedient/ModalPublishBulletin";
import { PageElectronicExpedient } from "../../../page/functionary/PageElectronicExpedient";

describe('Ingreso de acuerdos del funcionario', () => {

    let testData, tramite = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    
    before(() => {
        
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
          testData = data;
          tramite = testData.tramite;
        })

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
          
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    it('Find expedient and set url', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });

    it('Se ingresa un documento de tipo acuerdo al expediente', () => {

        cy.visit(tramite.url, {failOnStatusCode: false});
        const exp = PageElectronicExpedient();
        exp.action
        
        
        
    })

})


// TODO Revisar ya que tira codigo 422 en lugar de 200