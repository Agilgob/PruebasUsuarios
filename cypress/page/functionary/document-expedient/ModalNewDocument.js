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

    inputLabel(){
        return this.modal().find('[placeholder="Agrega una etiqueta para identificar este documento"]');
    }

    inputPromoterName(){
        return this.modal().find('input[aria-label="Nombre del promovente"]');
    }

    radioAddAnnex(annex = false){
        const radio = annex ? 'si' : 'no';
        this.modal()
            .contains('label', '¿Quieres agregar anexos?')
            .parent()
            .find(`input[type=radio][value="${radio}"]`)
            .check();
    }

    btnSign(){
        return this.modal().find('.modal-footer').contains('button', 'Firmar');
    }

    btnCancel(){
        return this.modal().find('.modal-footer').contains('button', 'Cancelar');
    }
}




