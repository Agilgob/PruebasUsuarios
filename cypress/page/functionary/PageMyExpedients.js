
export default class PageMyExpedients {
    constructor() {}

    btnAddExpedient() {
        return cy.get('button').contains('Agregar Expediente');
    }

    inputSearch() {
        return cy.get('input[placeholder="Escribe el número de expediente"]');
    }

    btnSearch() {
        return cy.get('button').contains('Buscar');
    }

    btnClearSearch() {
        return cy.get('button').contains('Limpiar');
    }

    btnTurnExpedient() {
        return cy.get('button').contains('Turnar expedientes seleccionados');
    }

    
}
export class PageMyExpedientsCommands extends PageMyExpedients {
    constructor() {
        super();
    }

    getAllExpedients(environment) {
        let expedientsQtyTotal = 0;
        let expedients = { "electronicExpedients": [] };

        cy.intercept('GET', '**/api/v1/electronic_expedients/find/user/**').as('getMyExpedients');
        cy.visit(environment.funcionarioURL + 'my_expedients');
        return cy.wait('@getMyExpedients').then((intercept) => {
            expedientsQtyTotal = intercept.response.body.data.total;
            expedients = { ...intercept.response.body.data, electronicExpedients: [] };
            console.log('EXPEDIENTES: ', intercept.response.body.data);
            return intercept.request;
        }).then((request) => {
            console.log('Request Headers: ', request.headers);
            return this.getExpedientsRecursively(request, 1, []);
        });
    }

    getExpedientsRecursively(request, page = 1, expedients = []) {
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
            return this.getExpedientsRecursively(request, page + 1, expedients);
        });
    }
}
