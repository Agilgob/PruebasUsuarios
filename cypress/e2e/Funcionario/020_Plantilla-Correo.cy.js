import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Agregar plantilla de correos', () => {


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
    

    it("Es posible agregar plantilla de notificaciones", () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, { failOnStatusCode: false });
    
        // const tabs = ['Acuerdos', 'Notificaciones', 'Sentencias', 'Correos', 'Oficios'];
        const tab = 'Correos'
        
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

        cy.get('@plantillas').eq(2).then(($plantilla) => {
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
        // // Llena documento texto enriquecido en body del iframe

        cy.get('@modalFormPlantilla').find('button').contains('Guardar').click();


        // // Valida que se muestra la nueva plantilla
        cy.get('@tabPanelContent').find('article button[class^="BadgeWithOptions"]').then(($plantillas) => {
            expect($plantillas).to.have.length.greaterThan(0)
            expect($plantillas).to.be.visible
        })


    });
    

});
