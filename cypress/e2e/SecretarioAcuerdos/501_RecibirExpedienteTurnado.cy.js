import { loadTestData, saveTestData } from "../../support/loadTestData";

describe('Recibe el expediente como segundo secretario', () => {



    before(() => { 
        loadTestData();
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
    
    it('Recibe el expediente en Expedientes > Expedientes por recibir', () => {
        
        if(!testData.expedienteTurnado.receiver) { // si es undefined o false
            throw new Error('El expediente no ha sido turnado a un segundo secretario');
        }

        cy.visit(environment.funcionarioURL);
        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Expedientes por recibir').click();

        cy.get('input.inputSearcher').type(testData.expediente.expedient_number)
        cy.contains('button', 'Buscar').click();


        cy.log(`:contains("${testData.expediente.expedient_number}")`)
        cy.get('table tbody tr').filter(`:contains("${testData.expediente.expedient_number}")`).first().as('expedienteRow');
        cy.get('@expedienteRow').find('input[type="checkbox"]')
            .should('not.be.checked')

        cy.get('@expedienteRow').contains('div', 'Recibir').click();

        cy.get('.modal-content').should('be.visible').then(() => {
            cy.screenshot('RecibirExpediente Modal');
        })
        cy.get('.modal-content').contains('Observaciones:').siblings('textarea')
            .type('Expediente recibido correctamente PRUEBAS CYPRESS');

        cy.get('.modal-content').contains('Recibí el expediente').siblings('input[type="checkbox"]')
            .should('not.be.checked')
            .click();
        cy.get('.modal-content').contains('Recibí el expediente').siblings('input[type="checkbox"]')
            .should('be.checked')
        
        cy.intercept('POST', `${environment.modeladorURL}api/v1/government_books/receive/*`).as('recibirExpediente');
        cy.get('.modal-content').contains('Aceptar').click();
        cy.wait('@recibirExpediente').then((interception) => {
            expect(interception.response.statusCode).to.eq(200);
            cy.screenshot('RecibirExpediente Aceptado');
            cy.writeFile('tmp/expedienteRecibido.json', interception.response.body);
            cy.wait(1000)
        })

    })

})
