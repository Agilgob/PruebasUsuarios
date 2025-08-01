
import { saveTestData } from "../../utilities/loadTestData";

Cypress.Commands.add('buscarExpediente', (testData) => {
    if (testData.expedientFound && testData.tramite.url) {
        cy.log('Escapando captura de ID ya que se encontró en testData.json');
        return;
    }

    // Navegar a la página inicial
    cy.visit(testData.environment.funcionarioURL, {failOnStatusCode: false});

    // Abrir menú lateral y navegar a la sección de búsqueda de expedientes
    cy.hamburguer().click();
    cy.sidebar('Expedientes').click();
    cy.sidebarExpedientes('Buscar expediente').click();

    // Buscar expediente
    cy.get('.searcherContainer .inputSearcher').type(testData.expedient.expedient_number);
    cy.contains('.buttonsSearch button', "Buscar").click();

    cy.contains('tr td a', testData.expedient.expedient_number).parent().parent().as('expedienteEncontrado');

    cy.get('@expedienteEncontrado').find('td a').click();

    // Esperar a que la URL cambie dinámicamente
    cy.url().should('include', '/expedient_details/').then((currentUrl) => {
        cy.log(currentUrl); // Muestra la URL en los logs de Cypress
        testData.tramite.url = currentUrl; // Guarda la URL en la variable `tramite`
        testData.expedientFound = true; 
        cy.writeFile('tmp/testData.json', testData, { log: false }); 
    });
});


Cypress.Commands.add('getActionButton', (buttonText) => {
    return cy.get('section[class^="ExpedientActions_actions"]', {timeout:10000}).find('button').filter(`:contains("${buttonText}")`).first()
})

Cypress.Commands.add('clickListarPartes', () => {
    cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
    cy.get('@accionesExpediente').get('button').filter(`:contains("Listar Partes")`).first().as('listarPartesBtn');
    cy.get('@listarPartesBtn')
        .should('be.visible')
        .and('be.enabled')
        .click()
})

Cypress.Commands.add('listarPartes', () => {

    cy.clickListarPartes()
    cy.get('.modal-dialog.modal-md').filter(':contains("Listado de partes")').first().as('modalListarPartes');
    cy.get('@modalListarPartes')
        .should('be.visible')
        .find('.modal-body div div.d-flex').should('have.length.at.least', 2)
    cy.get('@modalListarPartes').contains('Actor').should('exist')
    
    cy.screenshot('Listado de partes')
    cy.get('@modalListarPartes').find('.modal-footer').find('button').contains('Cerrar').click();

})

Cypress.Commands.add('descargarExpediente', (tramite) => {       
    cy.intercept('POST', `**/api/v1/download_zip/${tramite.url.split('/').pop()}`).as('descargarExpediente');
    cy.visit(tramite.url, {failOnStatusCode: false});
    cy.get('section[class^="ExpedientActions_actions"]').as('accionesExpediente');
    cy.get('@accionesExpediente').should('be.visible').and('have.descendants', 'button');
    cy.get('@accionesExpediente').get('button').filter(':contains("Descarga expediente")').first().click();
    cy.wait('@descargarExpediente').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.statusMessage).to.eq('OK');
        cy.log("DESCARGAR EXPEDIENTE RESPONSE " + JSON.stringify(interception.response));
    })
})

Cypress.Commands.add('clickTurnarExpediente', () => {
    cy.intercept('GET', '**api/v1/government_books/catalogs/dependences').as('dependences');
    cy.intercept('GET', '**/api/v1/courts/**').as('courts');

    cy.getActionButton("Turnar expediente").click();

    cy.wait(['@dependences', '@courts']).then((resp) => {
        const [dependences, courts] = resp;

        expect(dependences.response.statusCode).to.eq(200);
        expect(dependences.response.body.status).to.eq(true);

        expect(courts.response.statusCode).to.eq(200);
        expect(courts.response.body.status).to.eq(true);

        let r = {};
        r.courts = courts.response.body.data.users;
        r.dependences = dependences.response.body.data.dependences;
        cy.writeFile('tmp/dependencesAndCourts.json', r);
        return cy.wrap(r)
    })
})

Cypress.Commands.add('clickTurnadoIterno', () => {
    cy.getModal('Expedientes').as('modalTurnarExpediente');
    cy.getModal('Expedientes').getHeader().should('be.visible');
    cy.getModal('Expedientes').getHeader().should('contain.text', 'Expedientes');
    cy.getModal('Expedientes').getBody().as('modalBody');
    cy.get('@modalBody').should('be.visible');
    cy.get('@modalBody').find('form nav a').contains('Turnado interno').click();
})

Cypress.Commands.add('clickTurnadoExterno', () => {
    cy.getModal('Expedientes').as('modalTurnarExpediente');
    cy.getModal('Expedientes').getHeader().should('be.visible');
    cy.getModal('Expedientes').getHeader().should('contain.text', 'Expedientes');
    cy.getModal('Expedientes').getBody().as('modalBody');
    cy.get('@modalBody').should('be.visible');
    cy.get('@modalBody').find('form nav a').contains('Turnado externo').click();
})

Cypress.Commands.add('validaCamposTurnar', () => {
    cy.get('.form-group [class*="singleValue"]').as('valoresSelect');
    cy.get('@valoresSelect').each(($el, index, $list) => {
        expect($el.text().length).to.be.at.least(5);
    });
})

Cypress.Commands.add('seleccionaFuncionarioTurnar', () => {
    cy.getModal('Expedientes').as('modalExpedientes');
    cy.get('@modalExpedientes').contains('Da clic y elige algún usuario').click()

    // REVIEW selecciona el primer secretario que aparece en el menu de turnado
    cy.get('@modalExpedientes').find('.select-receiver__menu').children().first().click();
    
    })

Cypress.Commands.add('llenaCampoObservaciones', () => {
    cy.getModal('Expedientes').find('textarea[aria-label="Observaciones"]')
        .type('Turnado a Secretario Acuerdos desde pruebas automatizadas Cypress');
})

Cypress.Commands.add('transferirExpediente', (tipoTurnado) => {
    cy.getModal('Expedientes').as('modalExpedientes');
    cy.intercept('POST', `**/api/v1/government_books/release`).as('turnarExpediente');
    cy.get('@modalExpedientes').contains('button', 'Transferir').click(); 
    cy.wait('@turnarExpediente').then((interception) => {
        cy.log("Tipo de turnado: " + tipoTurnado);
        cy.log("/government_books/release RESPONSE BODY: " + JSON.stringify(interception.response.body));
        expect(interception.response.statusCode).to.eq(200);
        expect(interception.response.body.status).to.eq(true);
        expect(interception.response.body.code).to.eq(200);
        return cy.wrap(interception)
        // cy.writeFile(`tmp/expedienteTurnado${tipoTurnado}.json`, interception);        
    })
});

Cypress.Commands.add('intercambiaFuncionarioJsonFile', (interception) => {

    cy.fixture('funcionarios').then((funcionarios) => {
        cy.log('Funcionario antes de turnar: ' + funcionario.email);
        funcionario = funcionarios[funcionario.turnaA]
        cy.log('Funcionario despues del turnado: ' + funcionario.email);

        testData.expedienteTurnado = interception.response.body.data.governmentBook;
        testData.expedienteTurnado.receiver = interception.request.body.receiver;
        saveTestData();
    })
    
})


export function getExpedientDataByNumber(expedientNumber = ""){

    cy.hamburguer().click();
    cy.sidebar('Expedientes').should('be.visible').click()
    cy.sidebarExpedientes('Mis expedientes').click();
    cy.get('input.inputSearcher').as('searcher');
    cy.get('@searcher').type(expedientNumber);
    cy.contains('button', 'Buscar').click();
    cy.wait(2000);
    cy.get('.procedures-table-container table tbody tr').as('tr')
    // cy.get('@tr').should('have.length', 1);
    cy.get('@tr').contains(expedientNumber).parent().as('expedientRow');

    cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('expedientData');
    cy.get('@expedientRow').click();
    return cy.wait('@expedientData').then((interception) => {
        return cy.wrap(interception.response.body.data)
    })

};   

export function getExpedientDataById(expedientId = ""){
    const env =  Cypress.env('environment');
    cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('expedientData');
    cy.visit(`${env.funcionarioURL}/expedient_details/${expedientId}`);
    return cy.wait('@expedientData').then((interception) => {
        return cy.wrap(interception.response.body.data)
    })

};