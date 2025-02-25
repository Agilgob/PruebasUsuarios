import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Turnado interno de expediente', () => {


    before(() => { 
        loadTestData();

        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
        cy.fixture('funcionarios').then((funcionarios) => {
            secretarioParaTurnar = funcionarios['secretarioAcuerdos02']
            if(!secretarioParaTurnar.email){
                throw new Error("Abortada porque no se ha encontrado el funcionario a quien turnar");
            }
        })
    });

    beforeEach(() => {
        cy.session('sesionFuncionario', () => {
            
            cy.clearCookies();
            cy.clearLocalStorage();
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true // Ensures session is persisted across test files
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

        cy.intercept('GET', '*api/v1/government_books/catalogs/dependences').as('dependences');
        cy.get('@accionesExpediente').get('button').filter(':contains("Turnar expediente")').first().click();
        cy.wait('@dependences').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
        })

        cy.get('.modal-dialog.modal-xl .modal-content').filter(':contains("Expedientes")').first().as('modalTurnarExpediente');
        cy.get('@modalTurnarExpediente').find('.modal-header').should('be.visible');
        cy.get('@modalTurnarExpediente').find('.modal-header').should('contain.text', 'Expedientes');

        cy.get('@modalTurnarExpediente').find('.modal-body').as('modalBody');
        cy.get('@modalBody').should('be.visible');
        cy.get('@modalBody').find('form nav a').contains('Turnado interno').click();

        cy.wait(1000)

        // Cada uno de los campos deben tener al menos 5 caracteres
        cy.get('.form-group [class*="singleValue"]').as('valoresSelect');
        cy.get('@valoresSelect').each(($el, index, $list) => {
            expect($el.text().length).to.be.at.least(5);
        });

        cy.get('@modalBody').contains('Da clic y elige algún usuario').click()

        // REVIEW selecciona el primer secretario que aparece en el menu de turnado
        cy.get('@modalBody').find('.select-receiver__menu').children().first().click();
        cy.get('@modalBody').find('textarea[aria-label="Observaciones"]')
            .type('Turnado a Secretario Acuerdos desde pruebas automatizadas Cypress');

        
        cy.screenshot('Turnado de expediente')
        cy.get('@modalTurnarExpediente').find('.modal-footer').as('modalFooter');

        cy.intercept('POST', `${environment.modeladorURL}api/v1/government_books/release`).as('turnarExpediente');
        cy.get('@modalTurnarExpediente').contains('button', 'Transferir').click(); 
        cy.wait('@turnarExpediente').then((interception) => {
            cy.log("014 /government_books/release RESPONSE BODY: " + JSON.stringify(interception.response.body));
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body.status).to.eq(true);
            expect(interception.response.body.code).to.eq(200);

            cy.writeFile('tmp/expedienteTurnado.json', interception.response.body);

            cy.fixture('funcionarios').then((funcionarios) => {
                cy.log('Funcionario antes de turnar: ' + funcionario.email);
                funcionario = funcionarios[funcionario.turnaA]
                cy.log('Funcionario despues del turnado: ' + funcionario.email);

                testData.expedienteTurnado = interception.response.body.data.governmentBook;
                testData.expedienteTurnado.receiver = interception.request.body.receiver;
                saveTestData();
            })

        });

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


