

import { PageMyExpedientsCommands } from "../../page/functionary/PageMyExpedients";
import { PageLoginCommands } from "../../page/functionary/PageLogin";
import { getExpedientDataByNumber } from "../../page/functionary/expediente";

const environment = Cypress.env('environment');
const functionary = Cypress.env('funcionario');



describe('Satisface la precondicion cuando el testData no se encuentra en tmp', () => {

    beforeEach(() => {
        cy.on("uncaught:exception", (err, runnable) => {
            cy.log(err.message);
            return false;
        })
        const pageLogin = new PageLoginCommands();
        pageLogin.createSessionFunctionary(functionary.email, functionary.password, environment, functionary.email);

    });

    it('Capture all the files, select a candidate with the desired characteristics', () => {
        const pageMyExpedients = new PageMyExpedientsCommands();
        pageMyExpedients.getAllExpedients(environment).then((expedients) => {
            cy.log(`EXPEDIENTES FINAL: ${expedients.length}`); 

            cy.writeFile('tmp/expedients.json', expedients, { log: true });
            const filtered = expedients.filter(expedient => {
                return expedient.responsible === 'Yo' 
                    && expedient.released === false
                    && expedient.external === false;
            });

            cy.log(`EXPEDIENTES FILTRADOS: ${filtered.length}`);
            if (filtered.length === 0) {
                throw new Error('No expedients found that meet the search criteria');  }

            let expedientData = { ...filtered[0] };
            cy.visit(environment.funcionarioURL)
            getExpedientDataByNumber(expedientData.expedient_number).then((expedientData) => {
                cy.url().then((url) => {
                    expedientData['tramite'] = { url };
                    expedientData['expedientFound'] = true;
                    expedientData['expedientCreated'] = true
                    console.log(expedientData); 
                    cy.writeFile('tmp/testData.json', expedientData, { log: false });
                });
                
            })
            

        });
    });
})
//TODO : Este codigo esta hecho con las patas, se puede hacer en su mayoria con endpoints !!!