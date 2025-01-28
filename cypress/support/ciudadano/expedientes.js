
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


export function accedeAlExpediente(expedient_number, environment) {
    cy.visit(environment.ciudadanoURL);
    cy.get('.principal-nav  ul').as('menuPrincipal');
    cy.get('@menuPrincipal').contains('Mis expedientes').click();

    // Buscar el expediente
    cy.get('input#searcher').as('buscador');
    cy.get('@buscador').type(expedient_number);
    cy.get('@buscador').siblings('button').click();

    // Verificar que el expediente se encuentre en la lista
    cy.get('table.table.table-bordered', {timeout: 10000}).as('expedientes');
    cy.get('@expedientes').contains('a', expedient_number).click();
}


export function getAllExpedients(environment) {
    let request = null;
    let total = 0; // Número total de expedientes
    let expedientes = { "electronicExpedients": [] };

    cy.visit(environment.ciudadanoURL);
    cy.intercept('GET', '**/api/v1/electronic_expedients/find_expedient/10?page=1').as('getExpedients');

    cy.get('a[href="/my-expedients"]').click();

    // Obtiene los datos de la primera página con la primer consulta
    return cy.wait('@getExpedients').then((intercept) => {
        request = intercept.request;
        total = intercept.response.body.data.total;
        expedientes = { ...intercept.response.body.data, electronicExpedients: [] };
        return cy.wrap({ request, total, expedientes });

    }).then(({ request, total, expedientes }) => {

        const getExp = (page = 1) => {
            cy.request({
                method: 'GET',
                url: request.url.replace('page=1', `page=${page}`),
                headers: request.headers,
                log : false
            }).then((response) => {
                expedientes.electronicExpedients = [
                    ...expedientes.electronicExpedients,
                    ...response.body.data.electronicExpedients
                ];
                cy.log('EXPEDIENTES: ' + expedientes.electronicExpedients.length);
                if (expedientes.electronicExpedients.length < total) {
                    getExp(page + 1);
                }
            });
        };

        getExp();
        return cy.wrap(expedientes, {log:false});
    });
}
