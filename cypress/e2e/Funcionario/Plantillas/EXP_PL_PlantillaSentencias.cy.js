
describe('Agregar plantilla de sentencias', () => {


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
    

    it("Es posible agregar plantilla de sentencias", () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, { failOnStatusCode: false });
    
        // const tabs = ['Acuerdos', 'Notificaciones', 'Sentencias', 'Correos', 'Oficios'];
        const tab = 'Sentencias'
        
        // Hace click en agregar plantilla
        cy.get('[class^="Tabs_tabs"][data-rttabs="true"]').should('be.visible').as('pestanas');
        cy.get('@pestanas').contains('li', tab).should('be.visible').click();
        cy.get('@pestanas')
            .find('div section[class^="TemplateTabs_tabPanelContent"]').as('tabPanelContent') // section con botón de acción
        
        cy.get('@tabPanelContent')
            .should('be.visible')
            .and('have.descendants', 'button')
            .find('button[class^="ActionWidget_actionWidget"]') // botón de acción
            .should('be.visible')
            .and('be.enabled')
            .click();

        // Selecciona la primer plantilla de la lista
        cy.get('div[class^="ModalComponentPortal_modal_content"]').should('be.visible').as('modalPlantilla')
        cy.get('@modalPlantilla').find('section iframe').as('plantillas')
        cy.get('@plantillas').then(($plantillas) => {
            expect($plantillas).to.have.length.greaterThan(0)
        })

        cy.get('@plantillas').first().then(($plantilla) => {
            cy.wrap($plantilla).parent().find('span').invoke('text').then((text) => {
                cy.wrap($plantilla).click();
        
                // Guardamos la referencia del modal para reutilizarla
                cy.log('HEADER: ' + text);
                cy.contains('header', text)
                  .should('be.visible')
                  .parent()
                  .as('modalFormPlantilla');
            });
        });

        // Llena los campos de la plantilla

        cy.get('textarea[aria-label="Observaciones"]')
            .type('Observaciones de la plantilla pruebas automatizadas Cypress')
        cy.get('textarea[aria-label="Comentarios"]')
            .type('Comentarios de la plantilla pruebas automatizadas Cypress')
        cy.get('input[value="false"][name="publishBulletin"]').click()


        // // Llena documento texto enriquecido en body del iframe

        cy.get('@modalFormPlantilla').find('button').contains('Guardar').click();
        

        // // Valida que se muestra la nueva plantilla
        cy.get('@tabPanelContent').find('article button[class^="BadgeWithOptions"]').then(($plantillas) => {
            expect($plantillas).to.have.length.greaterThan(0)
            expect($plantillas).to.be.visible
        })


    });
    

});
