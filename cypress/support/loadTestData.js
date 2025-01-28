// cypress/support/loadTestData.js

export function loadTestData() {

    globalThis.testData = {};
    const envVars = {
        ciudadano: 'ciudadanos',
        tramite: 'tramites',
        environment: 'environments', 
        funcionario: 'funcionarios'
    };

    // Si se debe cargar desde el archivo
    if (Cypress.env('jsonFile')) { 
        cy.readFile(`tmp/testData.json`).then((jsonData) => {
            Object.entries(envVars).forEach(([envKey, _]) => {
                globalThis[envKey] = jsonData[envKey];
                globalThis.testData = jsonData; 
            });
        });
    // Si se debe cargar desde fixtures
    } else {
        Object.entries(envVars).forEach(([envKey, fixtureName]) => {
            cy.fixture(fixtureName).then((data) => {
                globalThis[envKey] = data[Cypress.env(envKey)];
                globalThis.testData[envKey] = data[Cypress.env(envKey)];
            });
        });
    }
}

export function saveTestData() {
    globalThis.testData.ciudadano = ciudadano;
    globalThis.testData.tramite = tramite;
    globalThis.testData.funcionario = funcionario;
    globalThis.testData.environment = environment;
    cy.writeFile('tmp/testData.json', testData);
}