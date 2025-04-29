import { en } from "@faker-js/faker";

const environment = Cypress.env('environment');
const ciudadano = Cypress.env('ciudadano');
const funcionario = Cypress.env('funcionario');


const functionarySession = () => {
    // cy.session('funcionario', () => {
        cy.visit(environment.funcionarioURL);
        cy.loginFuncionario(funcionario.email, funcionario.password);
        cy.getCookie('authentication_token_03').should('exist');
    // }, {
    //     cacheAcrossSpecs: true
    // }); 
    cy.visit(environment.funcionarioURL);
}

const citizenSession = () => {
    // cy.session('ciudadano', () => {
        cy.visit(environment.ciudadanoURL);
        cy.loginCiudadano(ciudadano.email, ciudadano.password);
        cy.wait(2000);
        cy.getCookie('authentication_token_02').should('exist');
    // }, {
    //     cacheAcrossSpecs: true
    // });
    cy.visit(environment.ciudadanoURL);
}


describe('Manejar sesiones funcionario y ciudadano', () => {

    let documents;
    let expedientNumber = Cypress.env('expedientNumber');
    

    it('FUNCIONARIO - Captura documentos y permisos del expediente', () => {
        functionarySession();
        cy.hamburguer().click();
        cy.sidebar('Expedientes').click();
        cy.sidebarExpedientes('Buscar expediente').click();
        cy.get('.searcherContainer .inputSearcher').type(expedientNumber);
        cy.contains('.buttonsSearch button', "Buscar").click();
        cy.contains('tr td a', expedientNumber).parent().parent().as('expedienteEncontrado');

        cy.intercept('GET', '**/api/v1/document_expedients/documents/*/10?page=1').as('getDocuments');

        cy.get('@expedienteEncontrado').find('td a').click();
        cy.wait('@getDocuments').then((interception) => {

            const data = interception.response.body.data;
            documents = data.documents;
            expedientNumber = expedientNumber.replace(/\D/g, '-');
            cy.writeFile(`tmp/Expedient${expedientNumber}-Documents.json`, { data }, { log: false });

            const userPermissionsUrl =  'https://sandbox.nilo.cjj.gob.mx/api/v1/docuemnts_expedient/get_user_permissions/24206'
            cy.request({
                method: 'GET',
                url: `${environment.funcionarioURL}/api/v1/permissions/${expedientNumber}`,
                headers: interception.request.headers,

            }).then((response) => {
                expect(response.status).to.eq(200);
                cy.writeFile(`tmp/Expedient${expedientNumber}-Permissions.json`, response.body, { log: false });
            });

        });

        https://sandbox.nilo.cjj.gob.mx/api/v1/docuemnts_expedient/get_user_permissions/24206

    })
    
    // it('Login como ciudadano', () => {
    //     citizenSession();
    //     cy.wait(2000);
    // });
    
    // it('Accede como funcionario again', () => {
    //     functionarySession();
    //     cy.wait(2000);
    // });

    // it('Login como ciudadano again', () => {
    //     citizenSession();
    //     cy.wait(2000);
    // });

});
      