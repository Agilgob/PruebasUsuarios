export function agregarExpedienteBtn() {
    return cy.get('button#newTransfer');
}



export function getAllExpedients(environment) {
    // Devuelve todos los expedientes que el funcionario tiene en su bandeja Mis Expedientes
    let expedientsQtyTotal = 0; // Total of expedients for the current user
    let expedients = { "electronicExpedients": [] }; // All expedients object

    cy.intercept('GET', '**/api/v1/electronic_expedients/find/user/**').as('getMyExpedients'); 
    cy.visit(environment.funcionarioURL + 'my_expedients');
    return cy.wait('@getMyExpedients').then((intercept) => {
        expedientsQtyTotal = intercept.response.body.data.total;
        expedients = { ...intercept.response.body.data, electronicExpedients: [] };
        console.log('EXPEDIENTES: ', intercept.response.body.data);
        return intercept.request;
    }).then((request) => {
        console.log('Request Headers: ', request.headers);
        return getExpedientsRecursively(request, 1, 0, []);
        
    });
}


export const getExpedientsRecursively = function (request, page = 1, totalCount = 0, expedients = []) {
    return cy.request({
        method: 'GET',
        url: request.url.replace(/page=\d+/, `page=${page}`),
        headers: request.headers,
        log: false
    }).then((response) => {
        const { electronicExpedients } = response.body.data;
        const total = response.body.data.total;

        expedients = [...expedients, ...electronicExpedients];

        cy.log(`EXPEDIENTES acumulados: ${expedients.length}/${total}`);

        if (expedients.length >= total) {
            return cy.wrap(expedients, { log: false });
        }
        return getExpedientsRecursively(request, page + 1, total, expedients);
    });
};


