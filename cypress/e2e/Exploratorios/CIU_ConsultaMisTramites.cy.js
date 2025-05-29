import { loadTestData } from "../../support/loadTestData"
import { accedeAlExpediente } from "../../support/ciudadano/expedientes";
import { getAllExpedients } from "../../support/ciudadano/expedientes";


describe('Valida que los documentos en el expediente NO esten accesibles antes de tener un acuerdo', () => {

    const environment = Cypress.env('environment');
    const ciudadano = Cypress.env('ciudadano');
    let myExpedientUrl = null;
    let expedientsObject = null;

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.getCookie('authentication_token_02', { timeout: 5000 }).should('exist');
            cy.visit(environment.ciudadanoURL);
            cy.get('.principal-nav  ul', {log:false}).as('menuPrincipal');
            cy.get('@menuPrincipal', {log:false}).contains('Mis expedientes').click();
            cy.url().then((url) => {
                myExpedientUrl = url;
            });
        });
        cy.then(() => {
            cy.visit(myExpedientUrl);
        })
    });


    it('API : Captura los expedientes del ciudadano', () => {
        getAllExpedients(environment).then((expedients) => {
            expedientsObject = expedients;
            cy.log('EXPEDIENTES: ' + expedients.electronicExpedients.length);
            expect(expedients.electronicExpedients.length).to.be.greaterThan(0);
            cy.writeFile('tmp/expedientsObject.json', expedientsObject, { log: false });
        })
    })

    it('FILTROS PAGINACION : Los botones de paginacion se muestran correctamente', () => {
        cy.get('.dropdown-menu  .dropdown-item', {log:false}) // Botones de opciones de paginacion
            .should('exist')
            .should('not.be.visible')
            .should('have.length', 4)

        cy.get('#pageDropDown', {log:false}) // boton de dropdown de paginacion
            .should('exist')
            .should('be.visible')
            .click()

        cy.get('.dropdown-menu  .dropdown-item', {log:false}) // Botones de opciones de paginacion
            .should('exist')
            .should('be.visible')
            .should('have.length', 4)
    })

    it('FILTROS PAGINACION : Botones de paginación filtran correctamente los expedientes', () => {
        getAllExpedients(environment).then((expedients) => expedientsObject = expedients);
        cy.then(() => {cy.wait(1000)})

        const values = [10, 25, 30, 50];

        cy.get('#pageDropDown', { log: false }).as('expedientsPaginationButton');
        cy.get('section.procedures-table-container tbody tr', { log: false }).as('expedientsTableRows');
      
        values.forEach((cantidad) => {
            cy.get('@expedientsPaginationButton')
                .click()
                .then(() => {
                    cy.get(`.dropdown-menu .dropdown-item a`, {log:false})
                        .contains(`${cantidad}`, {log:false})
                        .should('be.visible', {log:false})
                        .parent({log:false})
                        .click({log:false});
        
                    cy.then(() => {
                        const total = expedientsObject.electronicExpedients.length;
                        let esperados = total >= cantidad ? cantidad : total;
                        esperados = esperados > 50 ? 50 : esperados;
                        cy.get('@expedientsTableRows').should('have.length', esperados);
                    });
                })
        
        });
    });
      
    it('TABLA EXPEDIENTES : HEADER se muestra correctamente', () => {
        const columnasEsperadas = [
            'No. expediente',
            'Partido Judicial',
            'Juzgado',
            'Tipo de Juicio',
            'Vía'
            ];

        cy.get('section.procedures-table-container thead tr th').each(($th, index) => {
            cy.wrap($th).should('have.text', columnasEsperadas[index]);
        });
    })

    it('TABLA EXPEDIENTES : BODY se muestra correctamente', () => {
        cy.get('section.procedures-table-container', {log:false}).as('procedures');
        cy.get('@procedures', {log:false}).should('exist')
            .and('be.visible')
            .and('not.be.hidden')
        cy.get('@procedures').find('table tbody', {log:false}).as('tbody');
        cy.get('section.procedures-table-container tbody tr', {log:false}).should('have.length.at.least', 2);

    })



})

// TODO : Las columnas de la tabla se indican (internamente) como sorteables, sin embargo no se puede ordenar por ninguna columna

// TODO : Revisa los botones de paginacion de la misma forma que se hizo con el funcionario
// TODO : Probar la barra de busqueda asi como el boton de limpiar 
// TODO : Contar la cantidad de consultas que se hacen a los endpoints