import { loadTestData, saveTestData } from '../../support/loadTestData';


describe('Funcionario : Mis Expedientes', () => {

    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');

    beforeEach(() => {
        cy.on("uncaught:exception", (err, runnable) => {
            cy.log(err.message);
            return false;
        })
        cy.clearCookies();
        cy.clearLocalStorage();
    
        cy.session('sesionFuncionario', () => {
            cy.visit(environment.funcionarioURL);
            cy.loginFuncionario(funcionario.email, funcionario.password);
          
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });
    

    it('Valida los botones de paginación (numeros) y los registros que se muestran no deben duplicarse entre las vistas', () => {
        visitMyExpedients(environment);
      
        cy.get('.pagination .page-item')
          .filter((index, el) => {
            const number = parseInt(el.innerText, 10);
            return !isNaN(number) && number > 1;
          })
          .then((pageButtons) => {
            const totalPages = pageButtons.length;
      
            // Recorrer cada botón de paginación numérico (excepto el primero)
            Cypress._.range(0, totalPages).forEach((index) => {
              cy.get('.pagination .page-item')
                .filter((i, el) => {
                  const number = parseInt(el.innerText, 10);
                  return !isNaN(number) && number > 1;
                })
                .eq(index)
                .then(($button) => {
                  getExpedientsId().then((before) => {
                    cy.wrap($button).click();

                    cy.log(`BOTON : ${$button.text()}`);
                    
                    cy.wait(3000); // Opcional, mejor usar intercept si hay llamada de red
                    getExpedientsId().then((after) => {
                      cy.log(`Comparando página ${index + 1}`);
                      after.forEach((expedient) => {
                        expect(before).to.not.include(expedient);
                      });
                    });
                  });
                });
            });
          });
    });
      

    it('PAGINACION - API : Presenta la cantidad de peticiones que se hacen al servidor', () => {

        const endpoint = '**/api/v1/electronic_expedients/find/user/*/1/10?page=*'
        cy.intercept('GET', endpoint).as('getExpedients');

        visitMyExpedients(environment);

        cy.get('.pagination .page-item')
            .filter((index, el) => {
                const number = parseInt(el.innerText, 10);
                return !isNaN(number) && number > 1;
            })
            .then((pageButtons) => {
                const totalPages = pageButtons.length;

                Cypress._.range(0, totalPages).forEach((index) => {
                cy.get('.pagination .page-item', {log:false})
                    .filter((i, el) => {
                    const number = parseInt(el.innerText, 10);
                    return !isNaN(number) && number > 1;
                    }, {log:false})
                    .eq(index, {log:false})
                    .then(($button) => {
                    cy.wrap($button, {log:false}).click({log:false});
                    cy.log(`Clic en botón de página: ${$button.text()}`);
                    cy.wait(1000, {log:false}); // CAMBIAR POR INTERCEPT
                    });
                });
            });

        cy.wait('@getExpedients'); 
        cy.get('@getExpedients.all').then((calls) => {
            cy.log(`TOTAL PETICIONES ${endpoint}: ${calls.length}`);
        });
    })
    
    
    it('BARRA DE BUSQUEDA : Se muestra correctamente y filtra los expedientes', () => {
        // Selecciona uno de los expedientes aleatoriamente y valida que al buscarlo:
        // 1. El campo admite caracteres especiaales como "/" y "-"
        // 2. Se filtran los expedientes correctamente
        // 3. Se muestra el expediente correcto
        
        visitMyExpedients(environment);
        cy.get('input.inputSearcher').as('searcher');
        cy.get('@searcher', {log:false}).type('/');
        cy.get('@searcher', {log:false}).text().should('be.equal', '/');
        cy.get('@searcher', {log:false}).clear();
        cy.get('@searcher', {log:false}).type('-');
        cy.get('@searcher', {log:false}).text().should('be.equal', '-');
        cy.get('@searcher', {log:false}).clear();

        



    })
        
      
    
});

const visitMyExpedients = (environment) => {
    cy.visit(environment.funcionarioURL, {failOnStatusCode: false, log: false});
    cy.hamburguer().click();
    cy.sidebar('Expedientes').click();
    cy.sidebarExpedientes('Mis expedientes').click();
}

const getExpedientsId = () => {
    const expedients = [];
  
    cy.get('.procedures-table-container table tbody tr a[href]').each(($el) => {
      const text = $el.text().trim();
      expedients.push(text);
    });
  
    return cy.wrap(null).then(() => expedients); // esperar a que `each()` termine
};

  