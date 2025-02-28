
import { saveTestData } from "../loadTestData";

Cypress.Commands.add('buscarExpediente', (testData) => {
    if (testData.expedientFound && testData.tramite.url) {
        cy.log('Escapando captura de ID ya que se encontró en testData.json');
        cy.log("TEST_DATA :" + JSON.stringify(testData.tramite));
        cy.log("TRAMITE_URL :" + JSON.stringify(testData.tramite.url));
        return;
    }

    // Navegar a la página inicial
    cy.visit(testData.environment.funcionarioURL, {failOnStatusCode: false});

    // Abrir menú lateral y navegar a la sección de búsqueda de expedientes
    cy.hamburguer().click();
    cy.sidebar('Expedientes').click();
    cy.sidebarExpedientes('Buscar expediente').click();

    // Buscar expediente
    cy.get('.searcherContainer .inputSearcher').type(testData.expediente.expedient_number);
    cy.contains('.buttonsSearch button', "Buscar").click();

    cy.contains('tr td a', testData.expediente.expedient_number).parent().parent().as('expedienteEncontrado');

    cy.get('@expedienteEncontrado').find('td a').click();

    // Esperar a que la URL cambie dinámicamente
    cy.url().should('include', '/expedient_details/').then((currentUrl) => {
        cy.log(currentUrl); // Muestra la URL en los logs de Cypress
        testData.tramite.url = currentUrl; // Guarda la URL en la variable `tramite`
        testData.expedientFound = true;
        saveTestData(); 
    });
});


Cypress.Commands.add('getActionButton', (buttonText) => {
    return cy.get('section[class^="ExpedientActions_actions"]').find('button').filter(`:contains("${buttonText}")`).first()
})