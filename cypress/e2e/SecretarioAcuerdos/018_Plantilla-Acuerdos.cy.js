import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Agregar plantilla de acuerdos', () => {


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
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });


    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    



    it("Acuerdos, notificaciones, sentencias correos y oficios son accesibles", () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        let plantilla = null;

        cy.visit(tramite.url, { failOnStatusCode: false });
    
        // const tabs = ['Acuerdos', 'Notificaciones', 'Sentencias', 'Correos', 'Oficios'];
        const tab = 'Acuerdos'
        
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

        cy.llenarSelectModal('* Rubro', 'AUTOS A SU DISPOSICIÓN')       
        cy.llenarSelectModal('* Rubro', 'ANUNCIA PRUEBA')
        cy.get('textarea[aria-label="Observaciones"]')
            .type('Observaciones de la plantilla pruebas automatizadas Cypress')
        cy.get('textarea[aria-label="Comentarios"]')
            .type('Comentarios de la plantilla pruebas automatizadas Cypress')
        cy.get('input[value="false"][name="publishBulletin"]').click()
        cy.get("@modalFormPlantilla").contains('label', '¿Deseas responder promociones?').parent().as('responderPromociones')
        cy.get('@responderPromociones').find('input[class="form-check-input"]').then(($input) => {
            cy.log(`Estado inicial: ${$input.prop('checked')}`); 
        
            if ($input.prop('checked')) {
                cy.wrap($input).click(); // Desmarcar checkbox
            }
        });

        // cy.getIframeBody('div.screenshot-height-container iframe:nth-child(1)')
        //     .find('body p')
        //     .invoke('after', '<p>Este es un mensaje después del checkbox</p>');

        cy.get('@modalFormPlantilla').find('button').contains('Guardar').click();


        // Valida que se muestra la nueva plantilla
        cy.get('@tabPanelContent').find('article button[class^="BadgeWithOptions"]').then(($plantillas) => {
            expect($plantillas).to.have.length.greaterThan(0)
            expect($plantillas).to.be.visible
            
        })

            

    });
    

});
