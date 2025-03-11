import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Turnado interno de expediente', () => {


    before(() => { 
        loadTestData();

        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
        cy.fixture('funcionarios').then((funcionarios) => {
            const secretarioParaTurnar = funcionarios[funcionario.turnaA]
            if(!secretarioParaTurnar.email){
                throw new Error("Abortada porque no se ha encontrado el funcionario a quien turnar");
            }
        })
    });

    beforeEach(() => {
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password);
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
        cy.clickTurnarExpediente(); // support/funcionario/expediente.js
        cy.clickTurnadoIterno(); // support/funcionario/expediente.js

        cy.wait(1000)

        // Cada uno de los campos deben tener al menos 5 caracteres
        cy.validaCamposTurnar(); // support/funcionario/expediente.js
        cy.seleccionaFuncionarioTurnar(); // support/funcionario/expediente.js
        cy.screenshot('Turnado de expediente')
        cy.transferirExpediente(); // support/funcionario/expediente.js

       

    })

    it('Turnar, Permisos y Agregar documento estan deshabilidatos una vez turnado', () => {
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }
        if(!testData.expedienteTurnado.receiver) {
            throw new Error("Abortada porque no se ha turnado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});

        const acciones = ['Turnar expediente', 'Permisos de expediente', 'Agregar documento'];

        cy.log(`BOTONES DE ACCION ${acciones}`)

        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        acciones.forEach((accion) => {
            cy.get('@accionesExpediente').get('button').filter(`:contains("${accion}")`).first().as('actionBtn');
            cy.get('@actionBtn')
                .should('be.visible')
                .and('be.disabled')
                .and('have.descendants', 'i');
        })
    })

});


