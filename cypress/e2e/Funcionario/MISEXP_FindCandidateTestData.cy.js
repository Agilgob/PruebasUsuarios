import { fa } from '@faker-js/faker';
import { getAllExpedients } from '../../support/funcionario/misExpedientes/misExpedientesPage';
import {getExpedientDataById} from '../../support/funcionario/expediente';

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');

describe('Satisface la precondicion cuando el testData no se encuentra en tmp', () => {

    beforeEach(() => {
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password, environment);
    });

    it('Captura todos los expedientes, selecciona un candidato con las características deseadas', () => {
        getAllExpedients(environment).then((expedients) => {
            cy.log(`EXPEDIENTES FINAL: ${expedients.length}`); 

            cy.writeFile('tmp/expedients.json', expedients, { log: true });
            const filtered = expedients.filter(expedient => {
                return expedient.responsible === 'Yo' 
                    && expedient.released === false
                    && expedient.external === false;
            });

            cy.log(`EXPEDIENTES FILTRADOS: ${filtered.length}`);
            if (filtered.length === 0) {
                throw new Error('No se encontraron expedientes que cumplan con los criterios de búsqueda');
            }
            let expedientData = { ...filtered[0] };

            cy.url().then((url) => {
                expedientData['tramite'] = { url };
                expedientData['expedientFound'] = true;
                expedientData['expedientCreated'] = true;
                cy.writeFile('tmp/testData.json', expedientData, { log: false });
            }); 
            

        });
    });
})