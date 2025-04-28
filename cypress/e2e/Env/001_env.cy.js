import { loadTestData, saveTestData } from '../../support/loadTestData';
import {getNewExpedientId} from '../../support/commands';
import {getAllExpedients} from '../../support/ciudadano/expedientes';


const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');
const ciudadano = Cypress.env('ciudadano');

describe('Inicia Tramite desde el portal de ciudadano', () => {



    
    it('debe cargar las variables de entorno', () => {
        cy.log('environment', environment)
        console.log('funcionario', funcionario)
        console.log('ciudadano', ciudadano)

        expect(environment).to.exist;
        expect(environment).to.have.property('ciudadanoURL');
        expect(environment).to.have.property('funcionarioURL');

        expect(ciudadano).to.exist;
        expect(ciudadano).to.have.property('email');
        expect(ciudadano).to.have.property('password');

        expect(funcionario).to.exist;
        expect(funcionario).to.have.property('email');
        expect(funcionario).to.have.property('password');
        cy.writeFile('tmp/env.json', environment)
    })

})

