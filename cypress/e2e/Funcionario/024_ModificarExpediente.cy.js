import { loadTestData, saveTestData } from '../../support/loadTestData';

const findInputInModal = function (modalName, label){
    cy.getModal(modalName).contains('label', label).parent().find('input').as('input');
    return cy.get('@input');
}


describe('Funcionario : Modificar expediente ', () => {


    before(() => { 
        loadTestData();
        if(!testData.expedientFound) { // si es undefined o false
            testData.expedientFound = false;
        }
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
            cy.getCookie('authentication_token_03').should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    it('El expediente puede ser localizado desde el buscador', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });
    
    it('Permite editar el expediente ' , () => {
        
        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Modificar expedientes').should('be.visible').click()
        cy.get('section.searcherContainer').find('input').type(`${testData.expediente.expedient_number}{enter}`);

        cy.get('section.procedures-table-container').find('tr').filter(`:contains("${testData.expediente.expedient_number}")`).as('expedienteRow');
        cy.get('@expedienteRow')
            .then(($row) => {
                expect($row.length).to.be.equal(1);
                cy.wrap($row).find('div.edit').click()
            });
        
        cy.intercept('**/api/v1/matters/get_list').as('getMatters');
        cy.intercept('**/api/v1/electronic_expedient/crimes/*').as('getCrimes');
        cy.wait(['@getMatters', '@getCrimes']).then((interceptions) => {
            cy.log('GET MATTERS : ' + JSON.stringify(interceptions[0]));
            cy.log('GET CRIMES : ' + JSON.stringify(interceptions[1]));
        })

        cy.get('div.cardExpedientEdit.card').as('modalExpediente');
        cy.get('@modalExpediente').contains('label', 'Acción principal').parent().find('div[class$="placeholder"]')
            .click()
            .type('ABANDONO{enter}')

        cy.get('@modalExpediente').find('textarea[placeholder="Agrega una justificación"]')
            .type('Pruebas automatizadas cypress')

        cy.intercept('PUT', '**/api/v1/admin/electronic_expedients/*').as('putExpediente');
        cy.contains('button', 'Actualizar').click();
        cy.wait('@putExpediente').then((interception) => {
            
            expect(interception.response.statusCode).to.be.equal(200);
            expect(interception.response.body.data.message).to.be.equal('Expediente modificado');

            cy.log('PUT EXPEDIENTE MODIFICADO: ' + JSON.stringify(interception));
        })
    })
});
