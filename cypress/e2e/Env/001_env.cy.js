import { loadTestData, saveTestData } from '../../support/loadTestData';
import {getNewExpedientId} from '../../support/commands';
import {getAllExpedients} from '../../support/ciudadano/expedientes';

describe('Inicia Tramite desde el portal de ciudadano', () => {

    before(() => { 
        loadTestData();
    });

    beforeEach(() => {
        cy.session('ciudadano', () => {
            cy.visit(environment.ciudadanoURL);
            cy.loginCiudadano(ciudadano.email, ciudadano.password);
            cy.wait(2000);
            cy.getCookie('authentication_token_02').should('exist');
        });
    });

    
    
    it('Cambia funcionario 01', () => {
               
        getAllExpedients().then((expedients) => {
            cy.log(expedients);
            
            cy.writeFile('tmp/ciudadano_expedients_inicio.json', expedients);
        })
    });

});