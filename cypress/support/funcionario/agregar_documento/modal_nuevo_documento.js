

export function modalNewDocument() {
    return 
}





class ModalNewDocument {
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
    
    // Methods to interact with the modal


    multisign(multisign = false){ // TODO validar el funcionamiento de este metodo
        if(!multisign) {
            cy.get('label[for="isMultipleSignatureToggleButton"] div').click(); 
        }
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