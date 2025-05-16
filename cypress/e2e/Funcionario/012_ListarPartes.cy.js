import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Funcionario : Listar partes ', () => {

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
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password, environment);
    });
    
    

    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Muestra el modal para listar las partes' , () => {
        
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        
        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.listarPartes(); // support/funcionario/expediente

    })

});
