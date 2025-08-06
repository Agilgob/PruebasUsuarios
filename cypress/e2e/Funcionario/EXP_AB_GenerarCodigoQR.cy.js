
describe('Generar código QR', () => {

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
    


    it('Generar código QR', () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        cy.get('@accionesExpediente').should('be.visible');
        cy.get('@accionesExpediente').get('button').filter(':contains("Generar código QR")').first().click();

        cy.get('.modal-dialog .modal-content').filter(':contains("Generar código QR")').first().as('modalCodigoQR');
        cy.get('@modalCodigoQR').find('.modal-header').should('be.visible');
        cy.get('@modalCodigoQR').find('.modal-body').should('be.visible');
        cy.get('@modalCodigoQR').find('.modal-body').find('.form-group').should('have.length.greaterThan', 1);
        cy.get('@modalCodigoQR').find('.modal-body').find('.form-group')
            .filter(':contains("Todos los documentos")')
            .find('input')
            .click();
        
        cy.intercept('POST', `**/api/v1/electronic_expedients/${tramite.url.split('/').pop()}/qr`).as('getAllDocumentsForQR');
        cy.get('@modalCodigoQR').find('.modal-footer').find('button').contains('Generar QR').click();
        cy.wait('@getAllDocumentsForQR').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            expect(interception.response.body).to.have.property('data');
            expect(interception.response.body.data).to.have.property('qr');
           
        })
        cy.get('@modalCodigoQR').find('.modal-body').find('img[alt="QR"]').as('imagenQR')
        // cy.get('@imagenQR').should('be.visible'); // NOTA : No se visualiza en headless
        cy.get('@imagenQR').parent().should('have.descendants', 'button')
        cy.screenshot('Codigo QR generado')
        cy.get('@modalCodigoQR').find('.modal-footer').find('button').contains('Cancelar').click();

    })


});
