import { loadTestData, saveTestData } from '../../support/loadTestData';
import {getNewExpedientId} from '../../support/commands';
import {getAllExpedients} from '../../support/ciudadano/expedientes';



describe('Inicia Tramite desde el portal de ciudadano', () => {

    const environment = Cypress.env('environment');
    const functionary1 = Cypress.env('functionary1');
    const functionary2 = Cypress.env('functionary2');
    const citizen = Cypress.env('citizen');

    // before(() => { 
       
    // });

    // beforeEach(() => {
    //     cy.session('ciudadano', () => {
    //         cy.visit(environment.ciudadanoURL);
    //         cy.loginCiudadano(ciudadano.email, ciudadano.password);
    //         cy.wait(2000);
    //         cy.getCookie('authentication_token_02').should('exist');
    //     });
    // });
    
    it('debe cargar las variables de entorno', () => {
        expect(environment).to.exist;
        expect(functionary1).to.exist;
        expect(functionary2).to.exist;
        console.log('environment', environment);
        console.log('functionary1', functionary1);
        console.log('functionary2', functionary2);

        expect(environment).to.have.property('ciudadanoURL');
        expect(environment).to.have.property('functionaryURL');

    })

})