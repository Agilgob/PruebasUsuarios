import { loadTestData, saveTestData } from '../../utilities/loadTestData';
import {getNewExpedientId} from '../../support/commands';
import {getAllExpedients} from '../../page/citizen/expedientes';
import {ModalNewDocument} from '../../page/functionary/electronic-expedient/ModalAlertMultisign';
import {ModalElectronicSignature} from '../../page/functionary/electronic-expedient/ModalElectronicSignature';

const environment = Cypress.env('environment');
const funcionario = Cypress.env('funcionario');


describe('Inicia Tramite desde el portal de ciudadano', () => {


    let testData;
    let tramite;

    before(() => {
        
        cy.readFile('tmp/testData.json', { log: false, timeout: 500 }).then((data) => {
          testData = data;
          tramite = testData.tramite;
        })

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
          
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });
    
    
    it('debe cargar las variables de entorno', () => {

        cy.visit(tramite.url, {failOnStatusCode: false});
        cy.getActionButton('Agregar documento').should('be.visible').click(); 

        cy.llenarSelectModal('Tipo de documento', 'Acuerdo');
        const modalNewDocument = new ModalNewDocument();

        modalNewDocument.multisign(true);

        cy.wait(1000);
        modalNewDocument.multisign(false);
        modalNewDocument.modalAlertMultisign().btnAccept().click()
        cy.wait(1000);
        modalNewDocument.multisign(true);


        modalNewDocument.radioPubishToBulletin(true);
        modalNewDocument.inputJudge().should('be.visible');
        modalNewDocument.inputSecretary().should('be.visible');

        modalNewDocument.btnAddSignature().scrollIntoView().should('be.visible').click();
        
        const modalElectronicSignature = new ModalElectronicSignature();
        modalElectronicSignature.selectFirelFile('assets/Firel/COAA000405MJCRLDA6.pfx');
        modalElectronicSignature.inputPassword().clear().type('WrongPassword');
        modalElectronicSignature.btnAdd().scrollIntoView().should('be.visible').click();
        modalElectronicSignature.messageError().scrollIntoView().should('be.visible');
        cy.wait(3000);
        modalElectronicSignature.inputPassword().clear().type('Cordova2024');
        modalElectronicSignature.btnAdd().scrollIntoView().should('be.visible').click();

        modalNewDocument.selectPublishDate('2025-10-10');

        modalNewDocument.selectDocument('assets/documento.pdf')


    })

})

