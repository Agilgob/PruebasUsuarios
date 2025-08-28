
import { ModalPublishBulletin } from "../../../page/functionary/document-expedient/ModalPublishBulletin";
import { PageElectronicExpedient } from "../../../page/functionary/PageElectronicExpedient";
import { ModalElectronicSignature } from "../../../page/functionary/ModalElectronicSignature";
import { ModalManagePermissionsDocument } from "../../../page/functionary/ModalManagePermissionsDocument";


describe('Ingreso de acuerdos del funcionario', () => {

    let testData, tramite, documentLabel = null;
    const funcionario = Cypress.env('funcionario');
    const environment = Cypress.env('environment');

    
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

    it('Find expedient and set url', () => {
        cy.buscarExpediente(testData); // support/funcionario/expediente.js
    });

    it('Se ingresa un documento de tipo promocion al expediente', () => {

        cy.visit(tramite.url, {failOnStatusCode: false});

        const exp = new PageElectronicExpedient();
        const nd = new ModalPublishBulletin();
        const es = new ModalElectronicSignature();
        const mp = new ModalManagePermissionsDocument();

        cy.wait(1500);
        exp.actionButtons.btnAddDocument().scrollIntoView().should('be.visible').and('be.enabled').click()

        nd.multiselectDocumentType('Promoción')
        nd.btnAddSignature().click()

        es.loadFirelFile(funcionario.archivoFirel)
        es.inputPassword().should('be.visible').type(funcionario.passwordFirel)
        es.btnAdd().click()

        documentLabel = `Promocion de prueba ${Date.now()}`;
        nd.inputLabel().scrollIntoView().should('be.visible').type(documentLabel)
        nd.selectDocument('assets/promocion.pdf')
        nd.inputPromoterName().scrollIntoView().should('be.visible').type('Manuel Valdez')
        nd.radioAddAnnex(false)

        cy.intercept('POST', '**/api/v1/document_expedients/upload').as('uploadDocument')
        cy.wait(5000)
        nd.btnSign().click()
        cy.wait('@uploadDocument', { timeout: 60000 }).its('response.statusCode').should('eq', 200)

        mp.btnSave().scrollIntoView().should('be.visible').click()
        mp.getModalWarning().btnAccept().should('be.visible').click()

    })


    after(() => { //TODO hacer la validacion de la vista del documento en el expediente usando el nombre creado

        cy.visit(tramite.url, {failOnStatusCode: false});
        const ee = new PageElectronicExpedient();
        ee.documents.getTableRow(documentLabel).should('exist').and('be.visible');

        ee.documents.getTableRow(documentLabel).then( row => {
            ee.documents.getDotIndicator(row).should('exist').and('be.visible');
            ee.documents.getDotIndicator(row).should('have.class', 'dot-green');
            ee.documents.getDotIndicator(row).click();
        });
    });

})


// TODO Hacer la validacion de la fecha de vencimiento en el modal