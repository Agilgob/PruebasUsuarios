// export function getAllPromotions(desencadenador) {
//     let request = null;
//     let total = 0; 
//     let promociones = [];

//     cy.intercept('GET', '**/api/v1/document_expedients/active_promotions/**').as('getPromotions');
//     desencadenador()

//     // Obtiene los datos de la primera página con la primer consulta
//     return cy.wait('@getPromotions').then((intercept) => {
//         request = intercept.request;
//         total = intercept.response.body.data.total;
//         return cy.wrap({ request, total, promociones });

//     }).then(({ request, total, promociones }) => {

//         const getProm = (page = 1) => {
//             cy.request({
//                 method: 'GET',
//                 url: request.url.replace('page=1', `page=${page}`),
//                 headers: request.headers,
//                 log : false
//             }).then((response) => {
//                 promociones = [
//                     ...promociones,
//                     ...response.body.data.documents
//                 ];
//                 cy.log('PROMOCIONES: ' + promociones.length);
//                 if (promociones.length < total) {
//                     getProm(page + 1);
//                 }
//             });
//         };
//         getProm();

//         return cy.wrap(promociones, {log:false});
//     });
// }


export function getAllPromotions(desencadenador) {
    let request = null;
    let total = 0;
    let promociones = [];

    cy.intercept('GET', '**/api/v1/document_expedients/active_promotions/**').as('getPromotions');
    desencadenador();

    return cy.wait('@getPromotions').then((intercept) => {
        request = intercept.request;
        total = intercept.response.body.data.total;

        return cy.wrap({ request, total });
    }).then(({ request, total }) => {
        const totalPages = Math.ceil(total / 10); // Asumiendo que hay 10 elementos por página
        let requests = [];

        for (let page = 1; page <= totalPages; page++) {
            requests.push(
                cy.request({
                    method: 'GET',
                    url: request.url.replace('page=1', `page=${page}`),
                    headers: request.headers,
                    log: false
                }).then((response) => {
                    promociones = [
                        ...promociones,
                        ...response.body.data.documents
                    ];
                })
            );
        }

        return cy.wrap(Promise.all(requests)).then(() => {
            cy.log('PROMOCIONES TOTALES: ' + promociones.length);
            return cy.wrap(promociones, { log: false });
        });
    });
}
