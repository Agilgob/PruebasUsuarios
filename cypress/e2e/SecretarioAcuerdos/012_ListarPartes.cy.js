import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Funcionario : Listar partes ', () => {


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
            cy.contains('h3', 'Tablero de control', {timeout: 10000}).should('be.visible');
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Muestra el modal para listar las partes' , () => {
        
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});
        
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');

        cy.get('@accionesExpediente').get('button').filter(`:contains("Listar Partes")`).first().as('listarPartesBtn');
        cy.get('@listarPartesBtn')
            .should('be.visible')
            .and('be.enabled')
            .click()

        cy.get('.modal-dialog.modal-md').filter(':contains("Listado de partes")').first().as('modalListarPartes');
        cy.get('@modalListarPartes')
            .should('be.visible')
            .find('.modal-body div div.d-flex').should('have.length.at.least', 2)
        cy.get('@modalListarPartes').contains('Actor').should('exist')
        
        cy.screenshot('Listado de partes')
        cy.get('@modalListarPartes').find('.modal-footer').find('button').contains('Cerrar').click();

    })

});
