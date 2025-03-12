import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Acuerdos, notificaciones, sentencias correos y oficios son accesibles', () => {


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

        cy.visit(tramite.url, { failOnStatusCode: false });
    
        const tabs = ['Acuerdos', 'Notificaciones', 'Sentencias', 'Correos', 'Oficios'];
    
        cy.get('[class^="Tabs_tabs"][data-rttabs="true"]').should('be.visible').as('tabsTabs');
        cy.get('@tabsTabs').should('have.descendants', 'ul');
    
        tabs.forEach(($tab) => { 
            cy.get('@tabsTabs').contains('li', $tab).should('be.visible').click();
            cy.log(`TAB ${$tab} SELECCIONADO`);
    
            cy.get('@tabsTabs')
                .find('div section[class^="TemplateTabs_tabPanelContent"]') // section con botón de acción
                .should('be.visible')
                .and('have.descendants', 'button')
                .find('button[class^="ActionWidget_actionWidget"]') // botón de acción
                .should('be.visible')
                .and('be.enabled')
                .and('have.descendants', 'i')
                .and('have.descendants', 'span')
                .find('span')
                .then(($span) => {
                    cy.wrap($span).invoke('text').should('not.be.empty'); // Corrected assertion for text check
                    cy.log(`BOTON DE ACCION EN TAB ${$tab} ACCESIBLE TEXTO ${$span.text()}`);
                });
            cy.wait(1000)
        });
    });
    

});
