

export function getAllExpedients() {
  let expedientes = {};
  let paginas = 1;

  // Visitar la página y capturar la primera respuesta
  cy.visit(environment.ciudadanoURL);
  cy.intercept(
    'GET',
    new RegExp(`${environment.modeladorURL}api/v1/electronic_expedients/find_expedient/.*\\?page=\\d+`)
  ).as('expedients');

  cy.get('a[href="/my-expedients"]').click();

  // Esperar la primera carga de expedientes
  return cy.wait('@expedients').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    expedientes = interception.response.body.data;
    console.log('PRIMERA CONSULTA', expedientes);

    paginas = Math.ceil(expedientes.total / 10);

    // Si hay solo una página, devolver directamente
    if (paginas === 1) {
      return cy.wrap(expedientes);
    }

    // Si hay más de una página, realizar la paginación
    const fetchNextPage = (page = 2) => {
      if (page > paginas) {
        return cy.wrap(expedientes);
      }

      cy.intercept(
        'GET',
        new RegExp(`${environment.modeladorURL}api/v1/electronic_expedients/find_expedient/.*\\?page=${page}`)
      ).as('expedients');

      cy.get('li[title="next page"] a').click();

      return cy.wait('@expedients').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        const newExpedients = interception.response.body.data.electronicExpedients;

        if (!expedientes.electronicExpedients) {
          expedientes.electronicExpedients = [];
        }

        expedientes.electronicExpedients = expedientes.electronicExpedients.concat(newExpedients);
        console.log(`Página ${page} capturada`, expedientes);

        return fetchNextPage(page + 1); // Llamada recursiva para la siguiente página
      });
    };

    // Iniciar la paginación desde la página 2
    return fetchNextPage();
  });
}




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