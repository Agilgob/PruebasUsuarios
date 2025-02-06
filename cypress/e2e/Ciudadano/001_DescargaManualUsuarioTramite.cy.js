

describe('Inicia Tramite desde el portal de ciudadano', () => {
    let testData;
    let ciudadano;

    before(() => { 
        // Carga los datos del archivo de datos para utilizarlos en el test
        // ciudadano almacena los datos de cualquier Ciudadano en el archivo de datos
        cy.fixture('localhost').then((data) => {
            testData = data;
            ciudadano = testData.ciudadanoManuel;
        });
    });

    beforeEach(() => {
        cy.visit(testData.url.ciudadano);
        cy.loginCiudadano(ciudadano.email, ciudadano.password);
    });


    context("Descarga el manual de usuario del tramite", () => {
        it('Inicia un trámite y concluye la creacion', () => {
            // Ir a tramites disponibles
            cy.get('.principal-nav  ul').as('menuPrincipal');
            cy.get('@menuPrincipal').contains('Trámites disponibles').click();
    
            // Verifica que existan trámites disponibles
            cy.get('.procedure-card').should('have.length.greaterThan', 0);
    
            // Buscar un trámite
            cy.get('#searcher').type(ciudadano.tramite);
            cy.get('i.ti-search')
                .parent()
                .should('be.visible')
                .and('be.enabled')
                .click();
    
            // Filtrar el trámite y hacer clic en el botón
            cy.get('.procedure-card').filter(":contains('" + ciudadano.tramite + "')").first().as('tramite');
            cy.get('@tramite').find('.ti-agenda').click();
            cy.get(".notification-message").should('not.exist'); // to do - verificar que no exista mensaje de error


        });
    });
})
