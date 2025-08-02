
describe('El expediente enviado es visible en los Expedientes por recibir para el receptor', () => {

    let testData, tramite = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');
    
    before(() => {
        
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
          testData = data;
          tramite = testData.tramite;
        })

      });


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
          
            cy.getCookie('authentication_token_03', {timeout:5000}).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    
    it('El expediente enviado es visible en el panel de expedientes por recibir', () => {
        
        if(!testData.expedienteTurnado.receiver) { // si es undefined o false
            throw new Error('El expediente no ha sido turnado a un segundo secretario');
        }

        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Expedientes por recibir').click();

        cy.get('input.inputSearcher').type(testData.expedient.expedient_number)
        cy.contains('button', 'Buscar').click();

        cy.get('.procedures-table-container').should('exist');
        cy.get('.procedures-table-container').find('tbody tr').invoke('length').should('be.gte', 1);

    })

})
