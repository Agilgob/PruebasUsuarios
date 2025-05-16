import { loadTestData, saveTestData } from '../../support/loadTestData';
import { getExpedientData } from '../../support/funcionario/expediente';

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');

describe('Satisface la precondicion cuando el testData no se encuentra en tmp', () => {

    beforeEach(() => {
        if(!Cypress.env('expedientNumber')){
            throw new Error('No se ha definido el número de expediente en las variables de entorno');
        }
        cy.iniciarSesionFuncionario(funcionario.email, funcionario.password, environment);

    });
    
    it('captura los datos del expediente', () => {
        cy.visit(environment.funcionarioURL);
        getExpedientData(Cypress.env('expedientNumber')).then((expedientData) => {
            expedientData['expedientFound'] = true;
            expedientData['expedientCreated'] = true
            cy.url().then((url) => {
                expedientData['tramite'] = { url };
                console.log(expedientData); 
                cy.writeFile('tmp/testData.json', expedientData, { log: false });
            });
            
        })
    })

})