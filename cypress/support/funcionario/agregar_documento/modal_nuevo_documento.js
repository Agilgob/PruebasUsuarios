


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

    btnAddSignature() {
        return this.modal().find('button').contains('Agregar Firma');
    }

    btnChooseDocument() {
        return this.modal().find('div').contains('Selecciona un documento');
    }

    inputJudge(){
        return this.modal().contains('label', 'Nombre del Juez').siblings('input');
    }

    inputSecretary(){
        return this.modal().contains('label', 'Nombre del Secretario de Acuerdos').siblings('input');
    }

    textareaExcerptBulletin(){
        this.modal().find('textarea[aria-label="Extracto para boletín"]')
    }

    inputPublishBulletinDate(){
        return this.modal().find('input[placeholder="Da clic y elige la fecha correspondiente"]');
    }
    
    modalAlertMultisign(){
        return new ModalAlertMultisign();
    }

    // Methods to interact with the modal


    multisign(desiredState = false) {
        cy.get('input#isMultipleSignatureToggleButton')
        .invoke('prop', 'checked')
        .then((isChecked) => {
            if (isChecked !== desiredState) {
                cy.get('label[for="isMultipleSignatureToggleButton"] div').click();
            }
        });
    }

    // NOTA DE COMO USAR ESTA COSA:
    // modalNewDocument.multisign(false);
    // modalNewDocument.modalAlertMultisign().btnAccept().click()

    selectPublishDate(date = '2025-12-31') {
        this.inputPublishBulletinDate()
        .scrollIntoView()
        .should('be.visible')
        .click()
        .type(date, { force: true })
        .type('{enter}');
    }

    selectDocument(filePath) {
        this.modal().contains('div', 'Selecciona un documento')
            .find('input[type=file]')
            .selectFile(filePath, { force: true });
    }

    radioPubishToBulletin(publish = true){
        const radio = publish ? 'si' : 'no';
        this.modal()
            .contains('label', '¿Desea publicar en el boletín?')
            .parent()
            .find(`input[type=radio][value="${radio}"]`)
            .check();
    }

}



class ModalAlertMultisign{

    constructor() {}

    modal() {
        return cy.getModal('Atención');
    }

    btnAccept() {
        return this.modal().find('button').contains('Continuar');
    }

    btnCancel() {
        return this.modal().find('button').contains('Cancelar');
    }

    alertMessage() {
        return this.modal().find('h4');
    }
}