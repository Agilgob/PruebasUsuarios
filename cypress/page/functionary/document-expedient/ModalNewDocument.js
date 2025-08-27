import { ModalAlertMultiSign } from './ModalAlertMultiSign';

export class ModalNewDocument {
    constructor() {}

    modal() {
        return cy.getModal('Nuevo documento');
    }

    getAllDocumentTypes() {
        return cy.get('form .form-group').then($elements => {
            return Cypress._.map($elements, el => el.innerText);
        });
    }

    multiselectDocumentType(tipo = 'Promoción') {
        return cy.llenarSelectModal('Tipo de documento', tipo);
    }

    btnChooseDocument() {
        return this.modal().find('div').contains('Selecciona un documento');
    }

    selectDocument(filePath) {
        this.modal().contains('div', 'Selecciona un documento')
            .find('input[type=file]')
            .selectFile(filePath, { force: true });
    }

    radioPublishToBulletin(publish = true){
        const radio = publish ? 'si' : 'no';
        this.modal()
            .contains('label', '¿Desea publicar en el boletín?')
            .parent()
            .find(`input[type=radio][value="${radio}"]`)
            .check();
    }

}




