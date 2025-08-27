
import { ModalPublishBulletin } from "../../../page/functionary/document-expedient/ModalPublishBulletin";
import { PageElectronicExpedient } from "../../../page/functionary/PageElectronicExpedient";
import { ModalElectronicSignature } from "../../../page/functionary/ModalElectronicSignature";
import { ModalManagePermissionsDocument } from "../../../page/functionary/ModalManagePermissionsDocument";
describe('Ingreso de acuerdos del funcionario', () => {

    let testData, tramite = null;
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

        exp.actionButtons.btnAddDocument().should('be.visible').scrollIntoView().click()
        
        
        nd.multiselectDocumentType('Promoción')
        nd.btnAddSignature().click()

        es.loadFirelFile(funcionario.archivoFirel)
        es.inputPassword().should('be.visible').type(funcionario.passwordFirel)
        es.btnAdd().click()

        nd.inputLabel().scrollIntoView().should('be.visible').type(`Promocion de prueba ${Date.now()}`)
        nd.selectDocument('assets/promocion.pdf')
        nd.inputPromoterName().scrollIntoView().should('be.visible').type('Manuel Valdez')
        nd.radioAddAnnex(false)

        cy.intercept('POST', '**/api/v1/document_expedients/upload').as('uploadDocument')
        nd.btnSign().click()
        cy.wait('@uploadDocument').its('response.statusCode').should('eq', 200)

        mp.btnSave().scrollIntoView().should('be.visible').click()
        mp.getModalWarning().btnAccept().should('be.visible').click()

    })

    // after(() => { //TODO hacer la validacion de la vista del documento en el expediente usando el nombre creado
    //     // Guardar la informacion del expediente en el archivo testData.json
    //     cy.writeFile('tmp/testData.json', JSON.stringify(testData), { log: false, timeout: 500 });
    // });
})


// TODO Revisar ya que tira codigo 422 en lugar de 200