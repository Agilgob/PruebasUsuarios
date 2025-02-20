// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import './actions/login';
import './actions/demandaInicial';

import './funcionario/inicio';
import './funcionario/expediente';

import './overwrite'


Cypress.Commands.add('checkCitizenExpedients', (citizenURL, suffix="") => {
    
    cy.visit(citizenURL);

    const expedientsUrl = "https://sandbox.nilo.cjj.gob.mx/api/v1/electronic_expedients/find_expedient/10?page=1"; // To Do cambiar a fixture
        
    cy.intercept('GET', expedientsUrl).as('expedients');
    cy.get('a[href="/my-expedients"]').click();
    
    return cy.wait('@expedients').then((interception) => { // 🔹 Retornamos cy.wait para encadenarlo bien
        expect(interception.response.statusCode).to.eq(200);
        
        const expedients = interception.response.body.data;
        cy.exec('mkdir -p tmp');
        cy.writeFile(`tmp/ciudadano_expedients${suffix}.json`, expedients, {flag: 'w'});

        cy.log(`Expedientes saved: ${JSON.stringify(expedients, null, 2)}`);

        return cy.wrap(expedients); // 🔹 Cypress necesita que retornes un cy.wrap()
    });
});



export const getNewExpedientId = function (firstJson, finalJson) {
    if (!Array.isArray(firstJson) || !Array.isArray(finalJson)) {
        throw new Error("Los datos de entrada deben ser arrays");
    }

    let initialExpedients = firstJson.map(exp => exp.id);
    let finalExpedients = finalJson.map(exp => exp.id);
    const newId = finalExpedients.find(id => !initialExpedients.includes(id));

    // Buscar el objeto completo en finalJson
    return finalJson.find(exp => exp.id === newId) || null; 
};

