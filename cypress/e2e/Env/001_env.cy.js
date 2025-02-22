import { loadTestData, saveTestData } from '../../support/loadTestData';
import {getNewExpedientId} from '../../support/commands';

describe('Inicia Tramite desde el portal de ciudadano', () => {


    before(() => {
        loadTestData();
    });
    
    
    it('Ejemplo de uso de variables', () => {
        cy.readFile('tmp/ciudadano_expedients_inicio.json').then((first) => {
            cy.wrap(first).as('firstExpedients');
            cy.readFile('tmp/ciudadano_expedients_final.json').then((second) => {
                cy.wrap(second).as('secondExpedients');
                testData.expediente = getNewExpedientId(first.electronicExpedients, second.electronicExpedients);
                saveTestData();
            });
        })
    });

});