import { ModalNewDocument } from "./ModalNewDocument";

export class ModalSignedDocument extends ModalNewDocument {
    constructor(){
        super();
    }

    btnAddSignature() {
        return this.modal().find('button').contains('Agregar Firma');
    }

    multiSign(desiredState = false) {
        cy.get('input#isMultipleSignatureToggleButton')
        .invoke('prop', 'checked')
        .then((isChecked) => {
            if (isChecked !== desiredState) {
                cy.get('label[for="isMultipleSignatureToggleButton"] div').click();
            }
        });
    }

    getModalAlertMultiSign(){
        return new ModalAlertMultiSign();
    }
}   
