import { loadTestData, saveTestData } from '../../support/loadTestData';
import * as plantillas from '../../support/funcionario/expediente/plantillas';
import * as actionButtons from '../../support/funcionario/expediente/actionButtons';
import * as modalNuevoDocumento from '../../support/funcionario/expediente/modalNuevoDocumento';
import * as modalFirmaElectronica from '../../support/funcionario/modalFirmaElectronica';

describe('El expediente permite agregar documento Promocion', () => {


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
            cy.wait(2000);
            cy.getCookie('authentication_token_03', { timeout: 5000 }).should('exist');
        }, {
            cacheAcrossSpecs: true
        }); 
    });

    it('El expediente permite agregar documento Notificacion', () => {

        if(!testData.expedientFound) {
            throw new Error("Abortada porque no se ha encontrado el expediente");
        }

        cy.visit(tramite.url, {failOnStatusCode: false});
        plantillas.tabPlantilla('Correos').click()
        cy.wait(1000);
        plantillas.tabPanelContent().should('be.visible').then($contenedor => {
            const $el = Cypress.$($contenedor).find('article'); // uso de Cypress.$ para evitar error
            cy.log(`Cantidad de plantillas disponibles: ${$el.length}`);
            if ($el.length === 0) {
                plantillas.agregarPlantilla().click();
                plantillas.modalNuevaPlantilla().should('be.visible');
                plantillas.modalPlantillasDisponibles().first().click();
                plantillas.modalPlantillaGuardar().click();
            }
        });

        // plantillas.plantillasCargadas().first().click()

        // Agregar documento de tipo Notificación
        actionButtons.actionButton('Agregar documento').click();

        cy.llenarSelectModal('Tipo de documento', 'Notificación');
        modalNuevoDocumento.agregarFirmaButton().click();
        modalFirmaElectronica.modalFirmaElectronica().should('be.visible');
        modalFirmaElectronica.agregarArchivoButton().should('be.visible');
        modalFirmaElectronica.agregarArchivoFirmaFirel(funcionario.archivoFirel);
        modalFirmaElectronica.contrasenaInput().type(funcionario.passwordFirel);
        modalFirmaElectronica.agregarButton().click()


        modalNuevoDocumento.multifirmaButton().then($el => {
            if (!$el.prop('checked')) {
                cy.wrap($el).click({force: true});
            }
        });
       
        modalNuevoDocumento.cargarDocumento(funcionario.archivoAcuerdos);
        modalNuevoDocumento.deseaHacerNotifElectronica(true);
        modalNuevoDocumento.tipoNofiticacionRadio('Acuerdo')
        modalNuevoDocumento.firmarButton().click();

    });

});

// TODO LIST:
// Asegurarse que hay acuerdos previamente
// Seleccionar al menos algun acuerdo para hacer la notificacion
// validar que se envia el correco electronico