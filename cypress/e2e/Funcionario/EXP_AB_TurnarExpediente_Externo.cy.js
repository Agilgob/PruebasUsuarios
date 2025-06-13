import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Turnado interno de expediente', () => {

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


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Turnar el expediente a funcionario interno', () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }


        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        cy.get('@accionesExpediente').should('be.visible');
        cy.clickTurnarExpediente().then((responses) => {
            console.log(responses)
        }); // support/funcionario/expediente.js
        cy.clickTurnadoExterno()
        cy.getModal('Expedientes').getBody().as('modalExpedientesBody');
        cy.llenarSelectModal('* Elige la dependencia a la que turnaras este expedientes', 'Procuraduría Social (PROSOC)')
        
        cy.validaCamposTurnar(); // support/funcionario/expediente.js
        cy.llenaCampoObservaciones()
        cy.screenshot('Turnado de expediente externo')
        cy.transferirExpediente().then((interception) => {
            cy.writeFile('tmp/transferirExpedienteExterno.json', interception);
        })

       

    })

    // it('Turnar, Permisos y Agregar documento estan deshabilidatos una vez turnado', () => {
    //     if(!testData.expedientFound) {
    //         throw new Error("Abortada porque no se ha encontrado el expediente");
    //     }
    //     if(!testData.expedienteTurnado.receiver) {
    //         throw new Error("Abortada porque no se ha turnado el expediente");
    //     }

    //     cy.visit(tramite.url, {failOnStatusCode: false});

    //     const acciones = ['Turnar expediente', 'Permisos de expediente', 'Agregar documento'];

    //     cy.log(`BOTONES DE ACCION ${acciones}`)

    //     cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
    //     acciones.forEach((accion) => {
    //         cy.get('@accionesExpediente').get('button').filter(`:contains("${accion}")`).first().as('actionBtn');
    //         cy.get('@actionBtn')
    //             .should('be.visible')
    //             .and('be.disabled')
    //             .and('have.descendants', 'i');
    //     })
    // })

});


