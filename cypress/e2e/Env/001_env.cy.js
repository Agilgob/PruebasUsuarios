import { loadTestData, saveTestData } from '../../support/loadTestData';

describe('Inicia Tramite desde el portal de ciudadano', () => {


    before(() => {
        loadTestData();
        testData.expedientCreated = false;
    });
    
    
    it('Ejemplo de uso de variables', () => {
        cy.log(`testData ${JSON.stringify(testData)}`)
        cy.log(`ciudadano ${JSON.stringify(ciudadano)}`)
        cy.log(`funcionario ${JSON.stringify(funcionario)}`)
        cy.log(`environment ${JSON.stringify(environment)}`)
        cy.log(`tramite ${JSON.stringify(tramite)}`)

    });

    it('Ejemplo de uso de variables', () => {
       testData.todoFunca = "No del todo"
         saveTestData();

    });


});