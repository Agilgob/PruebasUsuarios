import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Action Buttons son accesibles', () => {


    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
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
    

    it("Los botones de accion son accesibles para el funcionario", () => {
        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
        cy.get('@accionesExpediente').should('be.visible');

        const acciones = ['Imprimir carátula', 'Turnar expediente', 'Indicadores', 'Permisos de expediente', 'Agregar documento',
            'Ver expediente completo', 'Descarga expediente', 'Generar código QR', 'Listar Partes'
        ];

        cy.log(`BOTONES DE ACCION ${acciones}`)

        acciones.forEach((accion) => {
            cy.get('@accionesExpediente').get('button').filter(`:contains("${accion}")`).first().as('imprimirCaratula');
            cy.get('@imprimirCaratula')
                .should('be.visible')
                .and('be.enabled')
                .and('have.descendants', 'i');
        })
    })

});