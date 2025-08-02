
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
          
            cy.getCookie('authentication_token_03', {timeout : 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    

    it('Turnar el expediente a funcionario interno', () => {

        const validateField = (label) => {
            cy.contains('b', label, {log: false})
              .closest('div', {log: false})
              .find('[class!="singleValue"]',  {log: false})
              .as('field');
          
            cy.get('@field', {log: false})
              .invoke('text')
              .then((text) => {
                const trimmed = text.trim();
                if (trimmed.length === 0) {
                  throw new Error(`El campo "${label}" se encuentra vacío.`);
                } else {
                  cy.log(`Campo "${label}" contiene: ${trimmed}`);
                }
              });
          };

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
        // cy.validaCamposTurnar(); // support/funcionario/expediente.js

        const labels = ['Número de expediente','Tipo de Juicio:', 'Vía:', 'Materia:' ]; 
        labels.forEach((label) => {
            validateField(label);
        })



        cy.seleccionaFuncionarioTurnar(); // support/funcionario/expediente.js
        cy.llenaCampoObservaciones()
        cy.screenshot('Turnado de expediente interno')
        cy.transferirExpediente('Interno').then(interception => {
            cy.writeFile(`tmp/expedienteTurnadoInterno.json`, interception);
            testData.expedienteTurnado = interception.response.body.data.governmentBook;
            testData.expedienteTurnado.receiver = interception.request.body.receiver;
            cy.writeFile('tmp/testData.json', testData, { log: false });

            // cy.intercambiaFuncionarioJsonFile(interception)
        }) // support/funcionario/expediente.js
    })

    it('"Turnar", "Permisos" y "Agregar documento" estan deshabilidatos una vez turnado', () => {
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


