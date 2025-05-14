import { loadTestData } from "../../support/loadTestData"
import { getAllExpedients } from "../../support/ciudadano/expedientes";

// let environment = null; Cypress.env('environment');
// let ciudadano = null; Cypress.env('ciudadano');


describe('Elimina Proyectos Envio', () => {

  const environment = Cypress.env('environment');
  const ciudadano = Cypress.env('ciudadano');
  let expedientes;

    // before(() => { 
    //     environment = Cypress.env('environment');
    //     ciudadano = Cypress.env('ciudadano');
    // });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
            getAllExpedients(environment).then((response) => {
                expedientes = response;
            })
        });
    })


    it('Elimina todos los proyectos de envio', () => {
        cy.visit(environment.ciudadanoURL);
        cy.getNavigationBar('Proyectos de envío').click();
        cy.wait(2000);

        function eliminarExpedientesRecursivamente() {
            cy.wait(1000)
            cy.get('body').should('be.visible').then(($body) => {
              if ($body.find('div.trash').length > 0) {
                cy.intercept('DELETE', '**/api/v1/procedure/delete/**').as('deleteExpedient');
          
                cy.get('div.trash').first().click();
                cy.getModal('Advertencia').getFooter().contains('button', 'Eliminar').click();
          
                cy.wait('@deleteExpedient').then((intercept) => {
                  expect(intercept.response.statusCode).to.eq(200);
                  cy.writeFile('ExpedienteEliminado.json', intercept);
          
                  // Esperamos a que el DOM se actualice antes de seguir
                  cy.wait(1000).then(() => {
                    eliminarExpedientesRecursivamente(); // Llamada recursiva
                  });
                });
              } else {
                cy.log('No hay más expedientes para eliminar');
              }
            });
          }
        
        eliminarExpedientesRecursivamente()

    });



    // after(() => {
    //     // Código para limpiar el estado después de todas las pruebas si es necesario
    // });
});