

// export function getAllExpedients__() {
//   let expedientes = {};
//   let paginas = 1;

//   // Visitar la página y capturar la primera respuesta
//   cy.visit(environment.ciudadanoURL);
//   cy.intercept(
//     'GET',
//     new RegExp(`${environment.modeladorURL}api/v1/electronic_expedients/find_expedient/.*\\?page=\\d+`)
//   ).as('expedients');

//   cy.get('a[href="/my-expedients"]').click();

//   // Esperar la primera carga de expedientes
//   return cy.wait('@expedients').then((interception) => {
//     expect(interception.response.statusCode).to.eq(200);
//     expedientes = interception.response.body.data;
//     console.log('PRIMERA CONSULTA', expedientes);

//     paginas = Math.ceil(expedientes.total / 10);

//     // Si hay solo una página, devolver directamente
//     if (paginas === 1) {
//       return cy.wrap(expedientes);
//     }

//     // Si hay más de una página, realizar la paginación
//     const fetchNextPage = (page = 2) => {
//       if (page > paginas) {
//         return cy.wrap(expedientes);
//       }

//       cy.intercept(
//         'GET',
//         new RegExp(`${environment.modeladorURL}api/v1/electronic_expedients/find_expedient/.*\\?page=${page}`)
//       ).as('expedients');

//       cy.get('li[title="next page"] a').click();

//       return cy.wait('@expedients').then((interception) => {
//         expect(interception.response.statusCode).to.eq(200);
//         const newExpedients = interception.response.body.data.electronicExpedients;

//         if (!expedientes.electronicExpedients) {
//           expedientes.electronicExpedients = [];
//         }

//         expedientes.electronicExpedients = expedientes.electronicExpedients.concat(newExpedients);
//         console.log(`Página ${page} capturada`, expedientes);

//         return fetchNextPage(page + 1); // Llamada recursiva para la siguiente página
//       });
//     };

//     // Iniciar la paginación desde la página 2
//     return fetchNextPage();
//   });
// }


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


export function accedeAlExpediente(expedient_number) {
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


export function getAllExpedients() {
    let request = null;
    let total = 0; // Número total de expedientes
    let expedientes = { "electronicExpedients": [] };

    cy.visit(environment.ciudadanoURL);
    cy.intercept('GET', '**/api/v1/electronic_expedients/find_expedient/10?page=1').as('getExpedients');

    cy.get('a[href="/my-expedients"]').click();
    return cy.wait('@getExpedients').then((intercept) => {
        request = intercept.request;
        total = intercept.response.body.data.total;
        expedientes = { ...intercept.response.body.data, electronicExpedients: [] };

        //cy.writeFile('Intercepted.json', intercept);

        cy.log('TOTAL:', total);
        cy.log('REQUEST:', request.url);

        return cy.wrap({ request, total, expedientes });
    }).then(({ request, total, expedientes }) => {

        const getExp = (page = 1) => {
            cy.request({
                method: 'GET',
                url: request.url.replace('page=1', `page=${page}`),
                headers: request.headers
            }).then((response) => {
                expedientes.electronicExpedients = [
                    ...expedientes.electronicExpedients,
                    ...response.body.data.electronicExpedients
                ];
                console.log('EXPEDIENTES: ', expedientes.electronicExpedients.length);
                if (expedientes.electronicExpedients.length < total) {
                    getExp(page + 1);
                }
            });

        };

        getExp();
        return cy.wrap(expedientes);
    });
}
